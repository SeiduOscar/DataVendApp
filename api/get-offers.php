<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../components/dbcon.php';

$network = $_GET['network'] ?? '';
$allowed = ['MTN', 'Telecel', 'AirtelTigo'];

if (!in_array($network, $allowed, true)) {
    echo json_encode(['network' => $network, 'offers' => [], 'error' => 'Invalid network']);
    exit;
}

try {
    $stmt = $dbhandle->prepare('SELECT offer, price FROM data_bundles WHERE Network = ?');
    $stmt->bind_param('s', $network);
    $stmt->execute();
    $result = $stmt->get_result();

    $offers = [];
    while ($row = $result->fetch_assoc()) {
        $offers[] = [
            'offer' => $row['offer'] . 'Gb',
            'price' => $row['price']
        ];
    }

    $stmt->close();

    echo json_encode(['network' => $network, 'offers' => $offers]);
} catch (Throwable $e) {
    echo json_encode(['network' => $network, 'offers' => [], 'error' => 'Server error']);
}
