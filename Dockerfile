FROM php:8.2-cli

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 10000

CMD ["php", "-d", "expose_php=0", "-d", "display_errors=0", "-S", "0.0.0.0:10000", "router.php"]
