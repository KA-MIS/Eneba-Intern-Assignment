<?php
declare(strict_types=1);

namespace App\Controllers;

use InvalidArgumentException;
use PDO;

final class ProductController
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function index(array $query = []): array
    {
        $search = $this->stringParameter($query, 'search', '');
        $category = $this->stringParameter($query, 'category', 'game');
        $platform = $this->stringParameter($query, 'platform', '');
        $region = $this->stringParameter($query, 'region', '');
        $genre = $this->stringParameter($query, 'genre', '');
        $os = $this->stringParameter($query, 'os', '');
        $productType = $this->stringParameter($query, 'productType', '');
        $sort = $this->stringParameter($query, 'sort', 'title_asc');
        $limit = $this->integerParameter($query, 'limit', 20, 1, 100);
        $page = $this->integerParameter($query, 'page', 1, 1, 100000);
        $offset = ($page - 1) * $limit;

        $sortOptions = [
            'title_asc' => 'title ASC',
            'title_desc' => 'title DESC',
            'price_asc' => 'lowest_price ASC',
            'price_desc' => 'lowest_price DESC',
            'random' => 'RANDOM()',
        ];

        if (!isset($sortOptions[$sort])) {
            throw new InvalidArgumentException('Invalid sort option.');
        }
        if (!in_array($category, ['game', 'gift_card'], true)) {
            throw new InvalidArgumentException('Invalid category.');
        }
        if (!in_array($platform, ['', 'PC', 'PS5', 'Xbox', 'Switch', 'DIGITAL'], true)) {
            throw new InvalidArgumentException('Invalid platform.');
        }
        if (!in_array($region, ['', 'GLOBAL', 'EUROPE', 'US'], true)) {
            throw new InvalidArgumentException('Invalid region.');
        }
        if (!in_array($os, ['', 'Windows', 'Mac', 'Linux'], true)) {
            throw new InvalidArgumentException('Invalid operating system.');
        }
        if (!in_array($productType, ['', 'Game', 'eGift Card'], true)) {
            throw new InvalidArgumentException('Invalid product type.');
        }

        $sql = <<<'SQL'
            WITH available_products AS (
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
                    p.steam_app_id,
                    p.product_type,
                    p.genres,
                    p.operating_systems,
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
            )
            SELECT *
            FROM available_products
            WHERE category = :category
        SQL;

        $parameters = [':category' => $category];

        if ($search !== '') {
            $sql .= " AND title ILIKE :search ESCAPE '\\'";
            $parameters[':search'] = '%' . str_replace(
                ['\\', '%', '_'],
                ['\\\\', '\\%', '\\_'],
                $search
            ) . '%';
        }
        if ($platform !== '') {
            $sql .= ' AND platform = :platform';
            $parameters[':platform'] = $platform;
        }
        if ($region !== '') {
            $sql .= ' AND region = :region';
            $parameters[':region'] = $region;
        }
        if ($genre !== '') {
            // Comma-separated genres use OR semantics: Action,RPG matches either.
            $requestedGenres = array_values(array_unique(array_filter(
                array_map('trim', explode(',', $genre)),
                static fn (string $item): bool => $item !== ''
            )));
            if (count($requestedGenres) > 12) {
                throw new InvalidArgumentException('Too many genres.');
            }
            $sql .= " AND genres && string_to_array(:genres, ',')";
            $parameters[':genres'] = implode(',', $requestedGenres);
        }
        if ($os !== '') {
            $sql .= ' AND :os = ANY(operating_systems)';
            $parameters[':os'] = $os;
        }
        if ($productType !== '') {
            $sql .= ' AND product_type = :product_type';
            $parameters[':product_type'] = $productType;
        }

        if (array_key_exists('minPrice', $query)) {
            $sql .= ' AND lowest_price >= CAST(:min_price AS numeric)';
            $parameters[':min_price'] = $this->priceParameter($query['minPrice'], 'minPrice');
        }
        if (array_key_exists('maxPrice', $query)) {
            $sql .= ' AND lowest_price <= CAST(:max_price AS numeric)';
            $parameters[':max_price'] = $this->priceParameter($query['maxPrice'], 'maxPrice');
        }
        if (isset($parameters[':min_price'], $parameters[':max_price'])
            && (float) $parameters[':min_price'] > (float) $parameters[':max_price']) {
            throw new InvalidArgumentException('minPrice cannot exceed maxPrice.');
        }

        $sql .= ' ORDER BY ' . $sortOptions[$sort];
        if ($sort !== 'random') {
            $sql .= ', id ASC';
        }
        $sql .= ' LIMIT :limit OFFSET :offset';

        $statement = $this->database->prepare($sql);
        foreach ($parameters as $name => $value) {
            $statement->bindValue($name, $value, PDO::PARAM_STR);
        }
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->execute();

        $products = [];
        foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $products[] = [
                'id' => $row['id'],
                'slug' => $row['slug'],
                'title' => $row['title'],
                'description' => $row['description'],
                'category' => $row['category'],
                'platform' => $row['platform'],
                'region' => $row['region'],
                'imageUrl' => $row['image_url'] ?? '',
                'publisher' => $row['publisher'] ?? '',
                'releaseDate' => $row['release_date'] ?? '',
                'steamAppId' => $row['steam_app_id'] === null ? null : (int) $row['steam_app_id'],
                'productType' => $row['product_type'],
                'genres' => $this->parsePgTextArray($row['genres']),
                'operatingSystems' => $this->parsePgTextArray($row['operating_systems']),
                'lowestPrice' => (float) $row['lowest_price'],
                'currency' => 'EUR',
                'offerCount' => (int) $row['offer_count'],
            ];
        }
        return $products;
    }

    public function show(string $slug): ?array
    {
        $statement = $this->database->prepare(
            <<<'SQL'
                SELECT
                    id, slug, title, description, category, platform,
                    region, image_url, publisher, release_date, steam_app_id,
                    product_type, genres, operating_systems
                FROM public.products
                WHERE slug = :slug
                LIMIT 1
            SQL
        );
        $statement->execute([':slug' => $slug]);
        $product = $statement->fetch(PDO::FETCH_ASSOC);
        if ($product === false) {
            return null;
        }

        $offersStatement = $this->database->prepare(
            <<<'SQL'
                SELECT
                    o.id, o.product_id, o.price, o.currency, o.available,
                    s.name AS seller_name, s.rating AS positive_rating
                FROM public.offers AS o
                INNER JOIN public.sellers AS s ON s.id = o.seller_id
                WHERE o.product_id = :product_id
                  AND o.available = TRUE
                  AND s.is_active = TRUE
                ORDER BY o.price ASC, o.id ASC
            SQL
        );
        $offersStatement->execute([':product_id' => $product['id']]);
        $offers = [];
        foreach ($offersStatement->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $offers[] = [
                'id' => $row['id'],
                'productId' => $row['product_id'],
                'sellerName' => $row['seller_name'],
                'positiveRating' => $row['positive_rating'] === null
                    ? null : (float) $row['positive_rating'],
                'price' => (float) $row['price'],
                'currency' => $row['currency'],
                'available' => (bool) $row['available'],
            ];
        }

        return [
            'id' => $product['id'],
            'slug' => $product['slug'],
            'title' => $product['title'],
            'description' => $product['description'] ?? '',
            'category' => $product['category'],
            'platform' => $product['platform'],
            'region' => $product['region'],
            'imageUrl' => $product['image_url'] ?? '',
            'publisher' => $product['publisher'] ?? '',
            'releaseDate' => $product['release_date'] ?? '',
            'steamAppId' => $product['steam_app_id'] === null
                ? null : (int) $product['steam_app_id'],
            'productType' => $product['product_type'],
            'genres' => $this->parsePgTextArray($product['genres']),
            'operatingSystems' => $this->parsePgTextArray($product['operating_systems']),
            'lowestPrice' => count($offers) > 0 ? $offers[0]['price'] : 0,
            'originalPrice' => null,
            'currency' => 'EUR',
            'offers' => $offers,
        ];
    }

    private function parsePgTextArray(mixed $value): array
    {
        if (!is_string($value) || $value === '{}' || $value === '') {
            return [];
        }
        // PostgreSQL text[] may contain quoted values with commas or escapes.
        $inner = substr($value, 1, -1);
        if ($inner === '') {
            return [];
        }
        $result = [];
        $current = '';
        $quoted = false;
        $escaped = false;
        $length = strlen($inner);
        for ($i = 0; $i < $length; $i++) {
            $char = $inner[$i];
            if ($escaped) {
                $current .= $char;
                $escaped = false;
            } elseif ($quoted && $char === '\\') {
                $escaped = true;
            } elseif ($char === '"') {
                $quoted = !$quoted;
            } elseif ($char === ',' && !$quoted) {
                $result[] = $current;
                $current = '';
            } else {
                $current .= $char;
            }
        }
        $result[] = $current;
        return $result;
    }

    private function stringParameter(array $query, string $name, string $default): string
    {
        $value = $query[$name] ?? $default;
        if (!is_string($value) || strlen($value) > 200) {
            throw new InvalidArgumentException("Invalid parameter: {$name}.");
        }
        return trim($value);
    }

    private function integerParameter(
        array $query,
        string $name,
        int $default,
        int $minimum,
        int $maximum
    ): int {
        $value = $query[$name] ?? $default;
        if (!is_scalar($value) || !ctype_digit((string) $value)) {
            throw new InvalidArgumentException("Invalid parameter: {$name}.");
        }
        $number = (int) $value;
        if ($number < $minimum || $number > $maximum) {
            throw new InvalidArgumentException("Parameter {$name} is out of range.");
        }
        return $number;
    }

    private function priceParameter(mixed $value, string $name): string
    {
        if (!is_string($value) && !is_int($value)) {
            throw new InvalidArgumentException("Invalid {$name}.");
        }
        $value = (string) $value;
        if (!preg_match('/^\d{1,7}(\.\d{1,2})?$/', $value)) {
            throw new InvalidArgumentException("Invalid {$name}.");
        }
        return $value;
    }
}
