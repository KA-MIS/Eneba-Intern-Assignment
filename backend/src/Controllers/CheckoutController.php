<?php

declare(strict_types=1);

namespace App\Controllers;

use InvalidArgumentException;
use PDO;
use RuntimeException;
use Throwable;

final class CheckoutController
{
    public function __construct(
        private readonly PDO $database
    ) {
    }

    public function checkout(
        array $payload,
        string $accessToken
    ): array {
        $userId = $this->verifyUser($accessToken);

        $requestId = $payload['requestId'] ?? null;
        $items = $payload['items'] ?? null;

        if (
            !is_string($requestId) ||
            !preg_match(
                '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
                $requestId
            )
        ) {
            throw new InvalidArgumentException(
                'Invalid checkout request ID.'
            );
        }

        if (
            !is_array($items) ||
            !array_is_list($items) ||
            count($items) < 1 ||
            count($items) > 20
        ) {
            throw new InvalidArgumentException(
                'Cart must contain 1 to 20 items.'
            );
        }

        $offerIds = [];

        foreach ($items as $item) {
            if (
                !is_array($item) ||
                !isset($item['offerId']) ||
                !is_string($item['offerId']) ||
                !preg_match(
                    '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
                    $item['offerId']
                ) ||
                ($item['quantity'] ?? null) !== 1
            ) {
                throw new InvalidArgumentException(
                    'Invalid cart item.'
                );
            }

            $offerIds[] = strtolower($item['offerId']);
        }

        if (count($offerIds) !== count(array_unique($offerIds))) {
            throw new InvalidArgumentException(
                'Duplicate offers are not allowed.'
            );
        }

        try {
            $this->database->beginTransaction();

            // Lock wallet to serialize purchases.
            $walletStatement = $this->database->prepare(
                'SELECT balance
                 FROM public.demo_wallets
                 WHERE user_id = :user_id
                 FOR UPDATE'
            );

            $walletStatement->execute([
                ':user_id' => $userId,
            ]);

            $wallet = $walletStatement->fetch();

            if (!$wallet) {
                throw new InvalidArgumentException(
                    'Demo wallet not found. Add demo funds first.'
                );
            }

            // Return the existing order for a repeated request.
            $existingStatement = $this->database->prepare(
                'SELECT id, order_number, total_amount
                 FROM public.orders
                 WHERE user_id = :user_id
                   AND checkout_request_id = :request_id
                 LIMIT 1'
            );

            $existingStatement->execute([
                ':user_id' => $userId,
                ':request_id' => $requestId,
            ]);

            $existing = $existingStatement->fetch();

            if ($existing) {
                $this->database->commit();

                return [
                    'orderId' => $existing['id'],
                    'orderNumber' => $existing['order_number'],
                    'total' => (float) $existing['total_amount'],
                    'alreadyProcessed' => true,
                ];
            }

            // Prices always come from the database.
            $offerStatement = $this->database->prepare(
                'SELECT
                    o.id,
                    o.product_id,
                    o.price,
                    o.currency,
                    p.title,
                    p.platform,
                    p.category
                 FROM public.offers o
                 JOIN public.products p
                    ON p.id = o.product_id
                 JOIN public.sellers s
                    ON s.id = o.seller_id
                 WHERE o.id = :offer_id
                   AND o.available = TRUE
                   AND s.is_active = TRUE
                   AND p.category IN (\'game\', \'gift_card\')
                 FOR SHARE OF o, p, s'
            );

            $validatedOffers = [];
            $totalCents = 0;

            sort($offerIds, SORT_STRING);

            foreach ($offerIds as $offerId) {
                $offerStatement->execute([
                    ':offer_id' => $offerId,
                ]);

                $offer = $offerStatement->fetch();

                if (!$offer) {
                    throw new InvalidArgumentException(
                        'An offer is no longer available.'
                    );
                }

                if ($offer['currency'] !== 'EUR') {
                    throw new InvalidArgumentException(
                        'Unsupported currency.'
                    );
                }

                $price = (string) $offer['price'];

                if (!preg_match(
                    '/^\d{1,8}(\.\d{1,2})?$/',
                    $price
                )) {
                    throw new InvalidArgumentException(
                        'Invalid offer price.'
                    );
                }

                [$whole, $fraction] = array_pad(
                    explode('.', $price, 2),
                    2,
                    '0'
                );

                $priceCents =
                    ((int) $whole * 100) +
                    (int) str_pad($fraction, 2, '0');

                if ($priceCents <= 0) {
                    throw new InvalidArgumentException(
                        'Invalid offer price.'
                    );
                }

                $totalCents += $priceCents;

                $validatedOffers[] = [
                    'product_id' => $offer['product_id'],
                    'title' => $offer['title'],
                    'platform' => $offer['platform'],
                    'price_cents' => $priceCents,
                ];
            }

            $total = sprintf(
                '%d.%02d',
                intdiv($totalCents, 100),
                $totalCents % 100
            );

            // Deduct balance only if sufficient funds remain.
            $deductStatement = $this->database->prepare(
                'UPDATE public.demo_wallets
                 SET balance = balance - :amount,
                     updated_at = NOW()
                 WHERE user_id = :user_id
                   AND balance >= :minimum_amount'
            );

            $deductStatement->execute([
                ':amount' => $total,
                ':minimum_amount' => $total,
                ':user_id' => $userId,
            ]);

            if ($deductStatement->rowCount() !== 1) {
                throw new InvalidArgumentException(
                    'Insufficient demo wallet balance.'
                );
            }

            $orderId = $this->uuidV4();

            $orderNumber = 'DEMO-' .
                strtoupper(
                    substr(
                        str_replace('-', '', $orderId),
                        0,
                        12
                    )
                );

            $orderStatement = $this->database->prepare(
                'INSERT INTO public.orders (
                    id,
                    user_id,
                    order_number,
                    total_amount,
                    currency,
                    status,
                    checkout_request_id
                 ) VALUES (
                    :id,
                    :user_id,
                    :order_number,
                    :total_amount,
                    :currency,
                    :status,
                    :request_id
                 )'
            );

            $orderStatement->execute([
                ':id' => $orderId,
                ':user_id' => $userId,
                ':order_number' => $orderNumber,
                ':total_amount' => $total,
                ':currency' => 'EUR',
                ':status' => 'paid',
                ':request_id' => $requestId,
            ]);

            $itemStatement = $this->database->prepare(
                'INSERT INTO public.order_items (
                    id,
                    order_id,
                    product_id,
                    product_name,
                    platform,
                    quantity,
                    unit_price
                 ) VALUES (
                    :id,
                    :order_id,
                    :product_id,
                    :product_name,
                    :platform,
                    1,
                    :unit_price
                 )'
            );

            $keyStatement = $this->database->prepare(
                'INSERT INTO public.game_keys (
                    order_item_id,
                    key_code
                 ) VALUES (
                    :order_item_id,
                    :key_code
                 )'
            );

            foreach ($validatedOffers as $offer) {
                $itemId = $this->uuidV4();

                $priceCents = $offer['price_cents'];

                $unitPrice = sprintf(
                    '%d.%02d',
                    intdiv($priceCents, 100),
                    $priceCents % 100
                );

                $itemStatement->execute([
                    ':id' => $itemId,
                    ':order_id' => $orderId,
                    ':product_id' => $offer['product_id'],
                    ':product_name' => $offer['title'],
                    ':platform' => $offer['platform'],
                    ':unit_price' => $unitPrice,
                ]);

                $keyStatement->execute([
                    ':order_item_id' => $itemId,
                    ':key_code' => 'DEMO-' .
                        strtoupper(
                            implode('-', str_split(bin2hex(random_bytes(10)), 5))
                        ),
                ]);
            }

            $transactionStatement = $this->database->prepare(
                'INSERT INTO public.demo_wallet_transactions (
                    user_id,
                    amount,
                    transaction_type,
                    description
                 ) VALUES (
                    :user_id,
                    :amount,
                    :transaction_type,
                    :description
                 )'
            );

            $transactionStatement->execute([
                ':user_id' => $userId,
                ':amount' => '-' . $total,
                ':transaction_type' => 'demo_purchase',
                ':description' => 'Demo purchase ' . $orderNumber,
            ]);

            $this->database->commit();

            return [
                'orderId' => $orderId,
                'orderNumber' => $orderNumber,
                'total' => $totalCents / 100,
                'alreadyProcessed' => false,
            ];

        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }
    }

    private function verifyUser(string $accessToken): string
    {
        $supabaseUrl = rtrim(
            trim($_ENV['SUPABASE_URL'] ?? ''),
            '/'
        );

        $publishableKey = trim(
            $_ENV['SUPABASE_PUBLISHABLE_KEY'] ?? ''
        );

        if ($supabaseUrl === '' || $publishableKey === '') {
            throw new RuntimeException(
                'Supabase Auth configuration is missing.'
            );
        }

        $handle = curl_init(
            $supabaseUrl . '/auth/v1/user'
        );

        if ($handle === false) {
            throw new RuntimeException(
                'Could not initialize authentication.'
            );
        }

        curl_setopt_array($handle, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'apikey: ' . $publishableKey,
                'Accept: application/json',
            ],
        ]);

        $response = curl_exec($handle);
        $status = curl_getinfo(
            $handle,
            CURLINFO_HTTP_CODE
        );

        $curlError = curl_error($handle);
        $curlErrno = curl_errno($handle);

        curl_close($handle);

        // Network or SSL failure.
        if ($response === false) {
            error_log(
                '[AUTH DEBUG] cURL error number: ' .
                $curlErrno .
                ' | Error: ' . $curlError
            );

            throw new RuntimeException(
                'Could not connect to Supabase Auth.'
            );
        }

        // Supabase rejected the authentication request.
        if ($status !== 200) {
            error_log(
                '[AUTH DEBUG] Supabase HTTP status: ' .
                $status
            );

            throw new InvalidArgumentException(
                'Invalid or expired authentication token.'
            );
        }

        $data = json_decode($response, true);

        $userId = $data['id'] ?? null;

        if (
            !is_string($userId) ||
            !preg_match(
                '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
                $userId
            )
        ) {
            throw new InvalidArgumentException(
                'Invalid authenticated user.'
            );
        }

        return $userId;
    }

    private function uuidV4(): string
    {
        $bytes = random_bytes(16);

        $bytes[6] = chr(
            (ord($bytes[6]) & 0x0f) | 0x40
        );

        $bytes[8] = chr(
            (ord($bytes[8]) & 0x3f) | 0x80
        );

        $hex = bin2hex($bytes);

        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($hex, 0, 8),
            substr($hex, 8, 4),
            substr($hex, 12, 4),
            substr($hex, 16, 4),
            substr($hex, 20)
        );
    }
}
