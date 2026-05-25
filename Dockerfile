FROM php:8.4-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    sqlite-dev \
    libzip-dev \
    zip \
    unzip \
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite zip

WORKDIR /app

# Expose port 8000
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
