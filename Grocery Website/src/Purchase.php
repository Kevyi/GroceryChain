<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'cmpe_131';
$user = 'root';
$password = '';

// Allow CORS and set content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate, max-age=0");

$conn = mysqli_connect($host, $user, $password, $dbname);
if (!$conn) {
    file_put_contents("php_debug.log", "Database connection failed: " . mysqli_connect_error() . "\n", FILE_APPEND);
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

// Log the raw incoming request
file_put_contents("php_debug.log", "Incoming Data: " . print_r($data, true) . "\n", FILE_APPEND);

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($data['cartItems'])) {
    $cartItems = $data['cartItems'];
    mysqli_begin_transaction($conn);

    try {
        foreach ($cartItems as $item) {
            $productId = $item['id'];
            $quantityPurchased = $item['quantity'];

            // Log each item being processed
            file_put_contents("php_debug.log", "Processing Item: ID = $productId, Quantity = $quantityPurchased\n", FILE_APPEND);

            // Fetch current stock
            $checkQuery = "SELECT Count FROM products WHERE id = ?";
            $stmt = mysqli_prepare($conn, $checkQuery);
            if (!$stmt) {
                file_put_contents("php_debug.log", "Failed to prepare SELECT query for Product ID = $productId\n", FILE_APPEND);
                throw new Exception("Failed to prepare SELECT query.");
            }
            mysqli_stmt_bind_param($stmt, "s", $productId);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $count);
            mysqli_stmt_fetch($stmt);
            mysqli_stmt_close($stmt);

            // Log stock count
            file_put_contents("php_debug.log", "Stock for Product ID $productId: $count\n", FILE_APPEND);

            if ($count === null) {
                throw new Exception("Product not found with ID: $productId.");
            }

            if ($count < $quantityPurchased) {
                throw new Exception("Insufficient stock for Product ID: $productId. Available: $count, Requested: $quantityPurchased.");
            }

            // Update inventory
            $updateQuery = "UPDATE products SET Count = Count - ? WHERE id = ?";
            $stmt = mysqli_prepare($conn, $updateQuery);
            if (!$stmt) {
                file_put_contents("php_debug.log", "Failed to prepare UPDATE query for Product ID = $productId\n", FILE_APPEND);
                throw new Exception("Failed to prepare UPDATE query.");
            }
            mysqli_stmt_bind_param($stmt, "is", $quantityPurchased, $productId);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            // Log successful update
            file_put_contents("php_debug.log", "Successfully updated Product ID $productId: Decreased by $quantityPurchased\n", FILE_APPEND);
        }

        // Commit transaction
        mysqli_commit($conn);
        echo json_encode(["status" => "success", "message" => "Purchase successful."]);
        file_put_contents("php_debug.log", "Transaction committed successfully.\n", FILE_APPEND);

    } catch (Exception $e) {
        // Rollback transaction
        mysqli_roll_back($conn);
        file_put_contents("php_debug.log", "Transaction rolled back. Error: " . $e->getMessage() . "\n", FILE_APPEND);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    file_put_contents("php_debug.log", "Invalid request method or missing cartItems.\n", FILE_APPEND);
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
file_put_contents("php_debug.log", "Connection closed.\n", FILE_APPEND);
