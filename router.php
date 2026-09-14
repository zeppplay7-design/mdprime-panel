<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . $path;

// El servidor integrado entrega directamente CSS, imágenes y demás archivos reales.
if ($path !== '/' && is_file($file)) {
    return false;
}

require __DIR__ . '/panel.php';
