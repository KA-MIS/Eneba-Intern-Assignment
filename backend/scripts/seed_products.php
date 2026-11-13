<?php
declare(strict_types=1);

use App\Database\Connection;
use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

Dotenv::createImmutable(dirname(__DIR__))->load();

$pdo = Connection::create();

$products = [
    [
        'slug' => 'the-witcher-3-wild-hunt',
        'title' => 'The Witcher 3: Wild Hunt',
        'description' => 'Explore a vast open world as Geralt of Rivia.',
        'category' => 'game',
        'platform' => 'PC',
        'region' => 'GLOBAL',
        'image_url' => '/images/the-witcher-3.jpg',
        'publisher' => 'CD Projekt',
        'release_date' => '2015-05-19',
        'offers' => [
            ['seller' => 'GameVault', 'price' => 12.99],
            ['seller' => 'DigitalPlanet', 'price' => 14.50],
        ],
    ],
    [
        'slug' => 'resident-evil-4-remake',
        'title' => 'Resident Evil 4',
        'description' => 'Survival horror reimagined for a new generation.',
        'category' => 'game',
        'platform' => 'PC',
        'region' => 'GLOBAL',
        'image_url' => '/images/resident-evil-4.jpg',
        'publisher' => 'Capcom',
        'release_date' => '2023-03-24',
        'offers' => [
            ['seller' => 'GameVault', 'price' => 24.99],
            ['seller' => 'KeyMasters', 'price' => 27.50],
        ],
    ],
];

$productStatement = $pdo->prepare(
    'INSERT INTO public.products (
        slug, title, description, category,
        platform, region, image_url,
        publisher, release_date
    ) VALUES (
        :slug, :title, :description, :category,
        :platform, :region, :image_url,
        :publisher, :release_date
    )
    ON CONFLICT (slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        platform = EXCLUDED.platform,
        region = EXCLUDED.region,
        image_url = EXCLUDED.image_url,
        publisher = EXCLUDED.publisher,
        release_date = EXCLUDED.release_date
    RETURNING id'
);

$sellerStatement = $pdo->prepare(
    'SELECT id
     FROM public.sellers
     WHERE name = :name AND is_active = TRUE'
);

$offerStatement = $pdo->prepare(
    'INSERT INTO public.offers (
        product_id, seller_id, price, currency, available
    ) VALUES (
        :product_id, :seller_id, :price, :currency, TRUE
    )
    ON CONFLICT (product_id, seller_id)
    DO UPDATE SET
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        available = TRUE'
);

try {
    $pdo->beginTransaction();

    foreach ($products as $product) {
        $productStatement->execute([
            'slug' => $product['slug'],
            'title' => $product['title'],
            'description' => $product['description'],
            'category' => $product['category'],
            'platform' => $product['platform'],
            'region' => $product['region'],
            'image_url' => $product['image_url'],
            'publisher' => $product['publisher'],
            'release_date' => $product['release_date'],
        ]);

        $productId = $productStatement->fetchColumn();
        $productStatement->closeCursor();

        foreach ($product['offers'] as $offer) {
            $sellerStatement->execute([
                'name' => $offer['seller'],
            ]);

            $sellerId = $sellerStatement->fetchColumn();
            $sellerStatement->closeCursor();

            if (!$sellerId) {
                throw new RuntimeException(
                    'Active seller not found: ' . $offer['seller']
                );
            }

            $offerStatement->execute([
                'product_id' => $productId,
                'seller_id' => $sellerId,
                'price' => $offer['price'],
                'currency' => 'EUR',
            ]);
        }

        echo "Imported: {$product['title']}\n";
    }

    $pdo->commit();
    echo "Import completed successfully.\n";

} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    fwrite(STDERR, "Import failed: {$error->getMessage()}\n");
    exit(1);
}
