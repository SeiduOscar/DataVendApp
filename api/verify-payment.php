<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../components/dbcon.php';
include '../components/paystack.php';

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$reference = isset($data['reference']) ? mysqli_real_escape_string($dbhandle, $data['reference']) : '';
$cidId = isset($data['cidId']) ? (int)$data['cidId'] : 0;

if (empty($reference) || $cidId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Reference and cidId are required']);
    exit;
}

$secretKey = $PAYSTACK_SECRET_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/transaction/verify/" . urlencode($reference));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$secretKey}",
    "Cache-Control: no-cache",
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['success' => false, 'message' => 'Verification request failed: ' . $curlError]);
    exit;
}

$result = json_decode($response, true);

if (!isset($result['status']) || $result['status'] !== true) {
    $message = isset($result['message']) ? $result['message'] : 'Payment verification failed';
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

$paymentStatus = isset($result['data']['status']) ? $result['data']['status'] : '';

if ($paymentStatus !== 'success') {
    echo json_encode(['success' => false, 'message' => 'Payment not successful']);
    exit;
}

$updateQuery = "UPDATE catalog SET Status = 1, payment_reference = '{$reference}' WHERE cidId = {$cidId}";
if (!mysqli_query($dbhandle, $updateQuery)) {
    echo json_encode(['success' => false, 'message' => 'Failed to update status: ' . mysqli_error($dbhandle)]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Payment verified and status updated']);

mysqli_close($dbhandle);
?>
