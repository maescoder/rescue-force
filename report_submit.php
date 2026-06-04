<?php
header('Content-Type: application/json');
require_once __DIR__ . '/inc/db_config.php';

$type = trim($_POST['animalType'] ?? '');
$location = trim($_POST['location'] ?? '');
$lat = $_POST['latitude'] ?? null;
$lng = $_POST['longitude'] ?? null;
$contact = trim($_POST['contact'] ?? '');
$rescuer = trim($_POST['rescuer'] ?? '');
$details = trim($_POST['info'] ?? '');
$urgency = $_POST['urgency'] ?? 'Low';
$urgency = in_array($urgency, ['Low','Medium','High']) ? $urgency : 'Low';

if (!$location || !$contact || !$rescuer) {
    echo json_encode(['success' => false, 'msg' => 'Location, contact and rescuer name are required.']);
    exit;
}

// Convert empty strings to null for DB decimal fields
$lat = ($lat !== '' && $lat !== null) ? (float)$lat : null;
$lng = ($lng !== '' && $lng !== null) ? (float)$lng : null;

try {
    $stmt = $pdo->prepare("INSERT INTO reports (type, location, latitude, longitude, contact, rescuer_name, details, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$type, $location, $lat, $lng, $contact, $rescuer, $details, $urgency]);
    echo json_encode(['success' => true, 'msg' => 'Report submitted. Thank you.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'msg' => 'DB error: ' . $e->getMessage()]);
}
