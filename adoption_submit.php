<?php
header('Content-Type: application/json');
require_once __DIR__ . '/inc/db_config.php';
require_once __DIR__ . '/inc/mailer.php';

$applicant_name = trim($_POST['fullName'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$petType = trim($_POST['petType'] ?? '');
$experience = trim($_POST['experience'] ?? '');
$living = trim($_POST['livingSituation'] ?? '');
$additional = trim($_POST['additionalInfo'] ?? '');

if (!$applicant_name || !$email) {
    echo json_encode(['success' => false, 'msg' => 'Name and email are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO adoptions (applicant_name, email, phone, pet_type, experience, living_situation, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$applicant_name, $email, $phone, $petType, $experience, $living, $additional]);
    
    // Attempt to send confirmation email
    sendAdoptionConfirmation($email, $applicant_name, $petType);
    
    echo json_encode(['success' => true, 'msg' => 'Adoption request submitted. We will contact you soon.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'msg' => 'DB error']);
}
