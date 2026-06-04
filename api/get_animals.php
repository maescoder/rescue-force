<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../inc/db_config.php';

try {
    // select only rows that have an image OR story
    $stmt = $pdo->prepare("SELECT id, name, species, story, image_path, rescued_on FROM animals ORDER BY created_at DESC LIMIT 200");
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // ensure image_path is a usable URL; if it's stored relative (uploads/...) we leave it as-is
    foreach ($rows as &$r) {
        if (empty($r['image_path'])) {
            $r['image_path'] = null;
        }
    }

    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([]);
}
