<?php

declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

use App\Database\Connection;
use Dotenv\Dotenv;

Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

function steamRequest(int $appId): ?array
{
    $url = 'https://store.steampowered.com/api/appdetails?'
        . http_build_query([
            'appids' => $appId,
            'cc' => 'us',
            'l' => 'en',
        ]);

    $curl = curl_init($url);

    if ($curl === false) {
        throw new RuntimeException('Could not initialize cURL.');
    }

    $certificate = dirname(__DIR__) . '/certs/cacert.pem';

    if (!is_file($certificate)) {
        throw new RuntimeException(
            'Steam CA certificate not found: ' . $certificate
        );
    }

    curl_setopt_array($curl, [
        CURLOPT_CAINFO => $certificate,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT => 'KamilasMarketplace/1.0',
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
        ],
    ]);

    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);

    curl_close($curl);

    if ($response === false || $status !== 200) {
        throw new RuntimeException(
            "Steam HTTP error {$status}: {$error}"
        );
    }

    $decoded = json_decode($response, true);

    if (!is_array($decoded)) {
        throw new RuntimeException('Invalid Steam JSON response.');
    }

    $result = $decoded[(string) $appId] ?? null;

    if (
        !is_array($result) ||
        ($result['success'] ?? false) !== true ||
        !is_array($result['data'] ?? null)
    ) {
        return null;
    }

    return $result['data'];
}

function postgresArray(array $values): string
{
    $quoted = [];

    foreach ($values as $value) {
        $value = str_replace(
            ['\\', '"'],
            ['\\\\', '\\"'],
            (string) $value
        );

        $quoted[] = '"' . $value . '"';
    }

    return '{' . implode(',', $quoted) . '}';
}

function normalizeGenres(array $genres): array
{
    $result = [];

    foreach ($genres as $genre) {
        if (!is_array($genre)) {
            continue;
        }

        $name = trim((string) ($genre['description'] ?? ''));

        if ($name !== '') {
            $result[] = $name;
        }
    }

    return array_values(array_unique($result));
}

function normalizePlatforms(array $platforms): array
{
    $result = [];

    if (($platforms['windows'] ?? false) === true) {
        $result[] = 'Windows';
    }

    if (($platforms['mac'] ?? false) === true) {
        $result[] = 'Mac';
    }

    if (($platforms['linux'] ?? false) === true) {
        $result[] = 'Linux';
    }

    return $result;
}

try {
    $dryRun = in_array('--dry-run', $argv, true);
    $limit = null;

    foreach ($argv as $argument) {
        if (preg_match('/^--limit=(\d+)$/', $argument, $matches)) {
            $limit = max(1, (int) $matches[1]);
        }
    }

    $database = Connection::create();

    $sql = <<<'SQL'
        SELECT id, title, steam_app_id
        FROM public.products
        WHERE category = 'game'
          AND steam_app_id IS NOT NULL
        ORDER BY title ASC
    SQL;

    if ($limit !== null) {
        $sql .= ' LIMIT ' . $limit;
    }

    $products = $database->query($sql)->fetchAll();

    $total = count($products);
    $updated = 0;
    $skipped = 0;
    $failed = 0;

    echo PHP_EOL;
    echo "======================================" . PHP_EOL;
    echo "       STEAM METADATA IMPORTER        " . PHP_EOL;
    echo "======================================" . PHP_EOL;
    echo "Products: {$total}" . PHP_EOL;
    echo "Mode: " . ($dryRun ? 'DRY RUN' : 'LIVE UPDATE') . PHP_EOL;
    echo "======================================" . PHP_EOL;

    $update = $database->prepare(
        <<<'SQL'
            UPDATE public.products
            SET
                genres = COALESCE(
                    CAST(:genres AS text[]),
                    genres
                ),
                operating_systems = COALESCE(
                    CAST(:operating_systems AS text[]),
                    operating_systems
                )
            WHERE id = :id
        SQL
    );

    foreach ($products as $index => $product) {
        $title = $product['title'];
        $appId = (int) $product['steam_app_id'];

        echo PHP_EOL;
        echo '[' . ($index + 1) . '/' . $total . '] ';
        echo $title . ' (App ID: ' . $appId . ')' . PHP_EOL;

        try {
            $data = steamRequest($appId);

            if ($data === null) {
                echo "  SKIPPED: Steam data unavailable." . PHP_EOL;
                $skipped++;
                usleep(500000);
                continue;
            }

            $genres = isset($data['genres'])
                && is_array($data['genres'])
                    ? normalizeGenres($data['genres'])
                    : null;

            $platforms = isset($data['platforms'])
                && is_array($data['platforms'])
                    ? normalizePlatforms($data['platforms'])
                    : null;

            if ($genres === null && $platforms === null) {
                echo "  SKIPPED: No metadata available." . PHP_EOL;
                $skipped++;
                usleep(500000);
                continue;
            }

            echo '  Genres: '
                . ($genres === null ? 'unchanged' : implode(', ', $genres))
                . PHP_EOL;

            echo '  OS: '
                . ($platforms === null ? 'unchanged' : implode(', ', $platforms))
                . PHP_EOL;

            if (!$dryRun) {
                $update->execute([
                    ':genres' => $genres === null
                        ? null
                        : postgresArray($genres),

                    ':operating_systems' => $platforms === null
                        ? null
                        : postgresArray($platforms),

                    ':id' => $product['id'],
                ]);

                echo "  UPDATED SUCCESSFULLY" . PHP_EOL;
            } else {
                echo "  DRY RUN: No database changes." . PHP_EOL;
            }

            $updated++;

        } catch (Throwable $exception) {
            $failed++;

            echo "  ERROR: "
                . $exception->getMessage()
                . PHP_EOL;
        }

        // Avoid sending requests too quickly.
        usleep(500000);
    }

    echo PHP_EOL;
    echo "======================================" . PHP_EOL;
    echo "             IMPORT REPORT            " . PHP_EOL;
    echo "======================================" . PHP_EOL;
    echo "Total:   {$total}" . PHP_EOL;
    echo "Updated: {$updated}" . PHP_EOL;
    echo "Skipped: {$skipped}" . PHP_EOL;
    echo "Failed:  {$failed}" . PHP_EOL;
    echo "======================================" . PHP_EOL;

} catch (Throwable $exception) {
    fwrite(
        STDERR,
        PHP_EOL . 'FATAL ERROR: ' . $exception->getMessage() . PHP_EOL
    );

    exit(1);
}
