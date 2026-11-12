<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

final class ProductController
{
    public function __construct(
        private readonly PDO $database
    ) {
    }

    public function index(): array
    {
        $sql = <<<'SQL'
            SELECT
                p.id,
                p.slug,
                p.title,
                p.description,
                p.category,
                p.platform,
                p.region,
                p.image_url,
                p.publisher,
                p.release_date,
                MIN(o.price) AS lowest_price,
                COUNT(o.id) AS offer_count
            FROM public.products AS p
            INNER JOIN public.offers AS o
                ON o.product_id = p.id
                AND o.available = TRUE
            INNER JOIN public.sellers AS s
                ON s.id = o.seller_id
                AND s.is_active = TRUE
            GROUP BY p.id
            ORDER BY p.title ASC
            LIMIT 50
        SQL;

        $statement = $this->database->prepare($sql);
        $statement->execute();

        $products = [];

        foreach ($statement->fetchAll() as $row) {
            $products[] = [
                'id' => $row['id'],
                'slug' => $row['slug'],
                'title' => $row['title'],
                'description' => $row['description'],
                'category' => $row['category'],
                'platform' => $row['platform'],
                'region' => $row['region'],
                'imageUrl' => $row['image_url'],
                'publisher' => $row['publisher'],
                'releaseDate' => $row['release_date'],
                'lowestPrice' => (float) $row['lowest_price'],
                'currency' => 'EUR',
                'offerCount' => (int) $row['offer_count'],
            ];
        }

        return $products;
    }
}
