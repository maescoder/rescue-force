<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db_config.php';

$key = $_POST['key'] ?? '';
$inc = isset($_POST['inc']) ? intval($_POST['inc']) : 1;

if (!$key) {
    echo json_encode(['success' => false, 'msg' => 'Missing key']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO stats (stat_key, stat_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE stat_value = stat_value + ?");
    $stmt->execute([$key, $inc, $inc]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'msg' => 'DB error']);
}
