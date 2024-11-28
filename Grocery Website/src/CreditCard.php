<?php
$host = 'localhost';
$dbname = 'cmpe_131';
$user = 'root';
$password = '';

// Allow CORS and set content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate, max-age=0");

// Establish database connection
$conn = mysqli_connect($host, $user, $password, $dbname);

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && $data) {
    // Validate input
    $requiredFields = ['full_name', 'address', 'city', 'state', 'zip_code', 'card_name', 'card_number', 'exp_month', 'exp_year', 'cvv'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            echo json_encode(["status" => "fail", "message" => "All fields are required: $field is missing."]);
            exit();
        }
    }

    $full_name = $data['full_name'];
    $address = $data['address'];
    $city = $data['city'];
    $state = $data['state'];
    $zip_code = $data['zip_code'];
    $card_name = $data['card_name'];
    $card_number = $data['card_number'];
    $exp_month = $data['exp_month'];
    $exp_year = $data['exp_year'];
    $cvv = $data['cvv'];

    // Prepare SQL query to match payment details
    $query = "SELECT id FROM CreditCardInfo WHERE 
                full_name = ? AND 
                address = ? AND 
                city = ? AND 
                state = ? AND 
                zip_code = ? AND 
                card_name = ? AND 
                card_number = ? AND 
                exp_month = ? AND 
                exp_year = ? AND 
                cvv = ?";

    $stmt = mysqli_prepare($conn, $query);

    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => "SQL error: " . mysqli_error($conn)]));
    }

    mysqli_stmt_bind_param($stmt, "ssssssssss", $full_name, $address, $city, $state, $zip_code, $card_name, $card_number, $exp_month, $exp_year, $cvv);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(["status" => "success", "message" => "Payment validation successful."]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Payment details do not match any records."]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
?>
