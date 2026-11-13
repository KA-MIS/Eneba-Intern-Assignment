FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    libpq-dev libcurl4-openssl-dev ca-certificates unzip git \
    && docker-php-ext-install pdo_pgsql curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction \
    --prefer-dist --optimize-autoloader

COPY src/ ./src/
COPY public/ ./public/
COPY certs/ ./certs/

CMD php -S 0.0.0.0:${PORT:-10000} -t public public/router.php
