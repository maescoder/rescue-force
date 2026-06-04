<?php
// api/adoption_action.php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once __DIR__ . '/../inc/db_config.php';

// require admin session
if (empty($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(403);
    echo json_encode(['success'=>false,'msg'=>'Unauthorized']);
    exit;
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$action = $_POST['action'] ?? '';

if (!$id || !in_array($action, ['approved','rejected','pending'])) {
    echo json_encode(['success'=>false,'msg'=>'Invalid parameters']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE adoptions SET status = ? WHERE id = ?");
    $stmt->execute([$action, $id]);
    echo json_encode(['success'=>true,'msg'=>'Request updated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'msg'=>'DB error']);
}
