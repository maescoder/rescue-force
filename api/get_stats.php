<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db_config.php';

try {
    $stmt = $pdo->prepare("SELECT stat_value FROM stats WHERE stat_key = 'rescued_count' LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch();
    $count = $row ? (int)$row['stat_value'] : 0;
    echo json_encode(['rescued_count' => $count]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['rescued_count' => 0, 'error' => 'DB error']);
}
