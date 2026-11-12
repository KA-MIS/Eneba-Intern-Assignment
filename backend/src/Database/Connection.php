<?php
declare(strict_types=1);

namespace App\Database;

use PDO;
use RuntimeException;

final class Connection
{
    public static function create(): PDO
    {
        $host = $_ENV['DB_HOST'] ?? '';
        $port = $_ENV['DB_PORT'] ?? '5432';
        $database = $_ENV['DB_NAME'] ?? '';
        $username = $_ENV['DB_USER'] ?? '';
        $password = $_ENV['DB_PASSWORD'] ?? '';

        if (
            $host === '' ||
            $database === '' ||
            $username === '' ||
            $password === ''
        ) {
            throw new RuntimeException(
                'Database configuration is incomplete.'
            );
        }

        if (
            !ctype_digit((string) $port) ||
            (int) $port < 1 ||
            (int) $port > 65535
        ) {
            throw new RuntimeException('Invalid database port.');
        }

        $certificate = dirname(__DIR__, 2)
            . '/certs/supabase-ca.crt';

        if (!is_file($certificate)) {
            throw new RuntimeException(
                'Supabase CA certificate not found.'
            );
        }

        $certificate = str_replace(
            '\\',
            '/',
            $certificate
        );

        $dsn = sprintf(
            'pgsql:host=%s;port=%d;dbname=%s;sslmode=verify-full;sslrootcert=%s',
            $host,
            (int) $port,
            $database,
            $certificate
        );

        return new PDO(
            $dsn,
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
}
