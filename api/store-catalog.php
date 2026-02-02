<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../components/dbcon.php';

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Extract data
$network = isset($data['network']) ? mysqli_real_escape_string($dbhandle, $data['network']) : '';
$price = isset($data['price']) ? mysqli_real_escape_string($dbhandle, $data['price']) : '';
$dataBundle = isset($data['data']) ? mysqli_real_escape_string($dbhandle, $data['data']) : '';
$contact = isset($data['contact']) ? mysqli_real_escape_string($dbhandle, $data['contact']) : '';
$email = isset($data['email']) ? mysqli_real_escape_string($dbhandle, $data['email']) : '';
$status = 0; // Default status

// Validate required fields
if (empty($network) || empty($price) || empty($dataBundle) || empty($contact) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Create catalog table if it doesn't exist with codId for email
$createTableQuery = "CREATE TABLE IF NOT EXISTS catalog (
    cidId INT AUTO_INCREMENT PRIMARY KEY,
    Network VARCHAR(50) NOT NULL,
    price VARCHAR(20) NOT NULL,
    Data VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    codId VARCHAR(100) NOT NULL,
    payment_reference VARCHAR(100) DEFAULT NULL,
    Status INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if (!mysqli_query($dbhandle, $createTableQuery)) {
    echo json_encode(['success' => false, 'message' => 'Failed to create table: ' . mysqli_error($dbhandle)]);
    exit;
}

// Ensure payment_reference column exists for existing tables
$columnCheckQuery = "SELECT COUNT(*) AS col_count FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalog' AND COLUMN_NAME = 'payment_reference'";
$columnCheckResult = mysqli_query($dbhandle, $columnCheckQuery);
if ($columnCheckResult) {
    $row = mysqli_fetch_assoc($columnCheckResult);
    if ((int)$row['col_count'] === 0) {
        $alterQuery = "ALTER TABLE catalog ADD COLUMN payment_reference VARCHAR(100) DEFAULT NULL";
        mysqli_query($dbhandle, $alterQuery);
    }
}

// Insert data into catalog table
$insertQuery = "INSERT INTO catalog (Network, price, Data, contact, codId, Status) 
                VALUES ('{$network}', '{$price}', '{$dataBundle}', '{$contact}', '{$email}', {$status})";

if (mysqli_query($dbhandle, $insertQuery)) {
    $cidId = mysqli_insert_id($dbhandle);
    echo json_encode([
        'success' => true, 
        'message' => 'Data stored successfully',
        'cidId' => (int)$cidId
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to store data: ' . mysqli_error($dbhandle)
    ]);
}

mysqli_close($dbhandle);
?>
