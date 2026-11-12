<?php

declare(strict_types=1);

use App\Controllers\ProductController;
use App\Database\Connection;
use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

$allowedOrigin = 'http://localhost:5173';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url(
    $_SERVER['REQUEST_URI'] ?? '/',
    PHP_URL_PATH
);

if ($method === 'OPTIONS') {
    if ($origin !== $allowedOrigin) {
        http_response_code(403);
        exit;
    }

    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($method !== 'GET') {
    header('Allow: GET, OPTIONS');
    http_response_code(405);

    echo json_encode([
        'error' => 'Method not allowed',
    ]);

    exit;
}

try {
    if ($path === '/api/health') {
        echo json_encode([
            'status' => 'ok',
        ]);
        exit;
    }

    if ($path === '/api/products') {
        $database = Connection::create();
        $controller = new ProductController($database);

        echo json_encode(
            [
                'data' => $controller->index(),
            ],
            JSON_THROW_ON_ERROR
        );

        exit;
    }

    http_response_code(404);

    echo json_encode([
        'error' => 'Endpoint not found',
    ]);
} catch (Throwable $exception) {
    error_log($exception->getMessage());

    http_response_code(500);

    echo json_encode([
        'error' => 'Internal server error',
    ]);
}
