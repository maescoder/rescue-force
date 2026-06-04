<?php
// api/get_adoptions.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../inc/db_config.php';

try {
    // return recent adoption requests (most recent first)
    $stmt = $pdo->prepare("SELECT id, applicant_name, email, phone, pet_type, experience, living_situation, additional_info, status, created_at FROM adoptions ORDER BY created_at DESC LIMIT 200");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([]);
}
