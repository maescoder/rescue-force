<?php
// inc/db_config.php
$DB_HOST = 'sql107.infinityfree.com';
$DB_NAME = 'if0_42096528_pet_rescue';
$DB_USER = 'if0_42096528';
$DB_PASS = 'ymslQZg2rgDuE'; 

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        $options
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}
