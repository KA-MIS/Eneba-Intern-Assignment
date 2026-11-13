<?php

declare(strict_types=1);

use App\Controllers\ProductController;
use App\Controllers\CheckoutController;
use App\Database\Connection;
use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$path = parse_url(
    $_SERVER['REQUEST_URI'] ?? '/',
    PHP_URL_PATH
);

if ($method === 'OPTIONS') {
    if (!in_array($origin, $allowedOrigins, true)) {
        http_response_code(403);
        exit;
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header(
        'Access-Control-Allow-Headers: Content-Type, Authorization'
    );

    http_response_code(204);
    exit;
}

try {
    // ======================================
    // HEALTH
    // ======================================

    if ($path === '/api/health' && $method === 'GET') {
        echo json_encode(['status' => 'ok']);
        exit;
    }

    // ======================================
    // CHECKOUT
    // ======================================

    if ($path === '/api/checkout' && $method === 'POST') {
        $contentLength = (int) (
            $_SERVER['CONTENT_LENGTH'] ?? 0
        );

        if ($contentLength > 16384) {
            http_response_code(413);

            echo json_encode([
                'error' => 'Request body too large.',
            ]);

            exit;
        }

        $authorization =
            $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (
            !preg_match(
                '/^Bearer ([A-Za-z0-9._~-]+)$/',
                $authorization,
                $matches
            )
        ) {
            http_response_code(401);

            echo json_encode([
                'error' => 'Authentication required.',
            ]);

            exit;
        }

        $body = file_get_contents(
            'php://input',
            false,
            null,
            0,
            16385
        );

        if ($body === false || strlen($body) > 16384) {
            http_response_code(413);

            echo json_encode([
                'error' => 'Request body too large.',
            ]);

            exit;
        }

        $payload = json_decode($body, true);

        if (!is_array($payload) || array_is_list($payload)) {
            throw new InvalidArgumentException(
                'Invalid JSON request body.'
            );
        }

        $controller = new CheckoutController(
            Connection::create()
        );

        $result = $controller->checkout(
            $payload,
            $matches[1]
        );

        echo json_encode(
            ['data' => $result],
            JSON_THROW_ON_ERROR
        );

        exit;
    }

    // ======================================
    // STEAM SCREENSHOTS GALLERY
    // ======================================

    if (
        $path === '/api/steam-gallery' &&
        $method === 'GET'
    ) {
        $appId = $_GET['appId'] ?? null;

        if (
            !is_string($appId) ||
            !preg_match('/^[1-9][0-9]{0,9}$/', $appId)
        ) {
            http_response_code(400);

            echo json_encode([
                'error' => 'Invalid Steam App ID.',
            ]);

            exit;
        }

        $steamUrl =
            'https://store.steampowered.com/api/appdetails' .
            '?appids=' . rawurlencode($appId) .
            '&l=english';

        $handle = curl_init($steamUrl);

        if ($handle === false) {
            throw new RuntimeException(
                'Could not initialize Steam request.'
            );
        }

        $responseBody = '';
        $maxResponseBytes = 1048576;

        $curlOptions = [
            CURLOPT_RETURNTRANSFER => false,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
            ],
            CURLOPT_WRITEFUNCTION => static function (
                $curl,
                string $chunk
            ) use (
                &$responseBody,
                $maxResponseBytes
            ): int {
                $length = strlen($chunk);

                if (
                    strlen($responseBody) + $length >
                    $maxResponseBytes
                ) {
                    return 0;
                }

                $responseBody .= $chunk;

                return $length;
            },
        ];

        $caBundle = dirname(__DIR__) .
            '/certs/cacert.pem';

        if (is_file($caBundle)) {
            $curlOptions[CURLOPT_CAINFO] = $caBundle;
        }

        curl_setopt_array($handle, $curlOptions);

        $success = curl_exec($handle);

        $steamStatus = (int) curl_getinfo(
            $handle,
            CURLINFO_HTTP_CODE
        );

        $curlError = curl_error($handle);

        curl_close($handle);

        if ($success === false || $steamStatus !== 200) {
            error_log(
                '[STEAM API] Request failed. HTTP: ' .
                $steamStatus .
                ' | Error: ' . $curlError
            );

            http_response_code(502);

            echo json_encode([
                'error' => 'Steam gallery unavailable.',
            ]);

            exit;
        }

        $steamData = json_decode(
            $responseBody,
            true
        );

        $gameData = $steamData[$appId]['data'] ?? null;

        if (
            !is_array($gameData) ||
            ($steamData[$appId]['success'] ?? false)
                !== true
        ) {
            echo json_encode([
                'data' => [
                    'screenshots' => [],
                ],
            ]);

            exit;
        }

        $screenshots = [];

        foreach (
            ($gameData['screenshots'] ?? []) as $shot
        ) {
            if (!is_array($shot)) {
                continue;
            }

            $url = $shot['path_full'] ?? null;

            if (!is_string($url)) {
                continue;
            }

            $parts = parse_url($url);

            if (!is_array($parts)) {
                continue;
            }

            $host = strtolower(
                $parts['host'] ?? ''
            );

            $allowedImageHosts = [
                'shared.fastly.steamstatic.com',
                'shared.akamai.steamstatic.com',
                'cdn.cloudflare.steamstatic.com',
                'steamcdn-a.akamaihd.net',
            ];

            if (
                ($parts['scheme'] ?? '') !== 'https' ||
                !in_array(
                    $host,
                    $allowedImageHosts,
                    true
                )
            ) {
                continue;
            }

            $screenshots[] = $url;

            if (count($screenshots) >= 6) {
                break;
            }
        }

        echo json_encode(
            [
                'data' => [
                    'screenshots' => $screenshots,
                ],
            ],
            JSON_THROW_ON_ERROR
        );

        exit;
    }

    // ======================================
    // PRODUCTS
    // ======================================

    if ($path === '/api/products' && $method === 'GET') {
        $controller = new ProductController(
            Connection::create()
        );

        echo json_encode(
            ['data' => $controller->index($_GET)],
            JSON_THROW_ON_ERROR
        );

        exit;
    }

    // ======================================
    // PRODUCT DETAILS
    // ======================================

    if (
        $method === 'GET' &&
        is_string($path) &&
        preg_match(
            '#^/api/products/([a-z0-9]+(?:-[a-z0-9]+)*)$#',
            $path,
            $matches
        )
    ) {
        $controller = new ProductController(
            Connection::create()
        );

        $product = $controller->show($matches[1]);

        if ($product === null) {
            http_response_code(404);

            echo json_encode([
                'error' => 'Product not found',
            ]);

            exit;
        }

        echo json_encode(
            ['data' => $product],
            JSON_THROW_ON_ERROR
        );

        exit;
    }

    // ======================================
    // METHOD NOT ALLOWED
    // ======================================

    if ($method !== 'GET') {
        header('Allow: GET, POST, OPTIONS');
        http_response_code(405);

        echo json_encode([
            'error' => 'Method not allowed',
        ]);

        exit;
    }

    http_response_code(404);

    echo json_encode([
        'error' => 'Endpoint not found',
    ]);

} catch (InvalidArgumentException $exception) {
    error_log(
        '[API VALIDATION] ' . $exception->getMessage()
    );

    http_response_code(400);

    echo json_encode([
        'error' => $exception->getMessage(),
    ]);

} catch (Throwable $exception) {
    error_log(
        '[API ERROR] ' .
        get_class($exception) .
        ': ' . $exception->getMessage() .
        ' | File: ' . $exception->getFile() .
        ' | Line: ' . $exception->getLine()
    );

    http_response_code(500);

    echo json_encode([
        'error' => 'Internal server error',
    ]);
}
