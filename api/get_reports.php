<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db_config.php';
require_once __DIR__ . '/../inc/auth.php';

if (!is_admin_logged_in()) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->query("SELECT id, type, location, latitude, longitude, contact, rescuer_name, urgency, created_at FROM reports ORDER BY created_at DESC");
    $reports = $stmt->fetchAll();
    echo json_encode($reports);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error: ' . $e->getMessage()]);
}
