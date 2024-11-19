<?php
$host = 'localhost';
$dbname = 'cmpe_131';  // Database name
$user = 'root';         // Database username
$password = '';         // Database password

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
    // Validate input fields
    if (empty($data['product_id']) || empty($data['product_name']) || empty($data['quantity']) || empty($data['price'])) {
        echo json_encode(["status" => "error", "message" => "Product ID, Name, Quantity, and Price are required."]);
        exit();
    }

    $product_id = $data['product_id'];
    $product_name = $data['product_name'];
    $quantity = $data['quantity'];
    $price = $data['price'];

    // Check if the product already exists in the products table
    $checkQuery = "SELECT * FROM products WHERE product_id = ?";
    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "s", $product_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        // Product exists, update its stock
        $updateQuery = "UPDATE products SET quantity = quantity + ? WHERE product_id = ?";
        $stmt_update = mysqli_prepare($conn, $updateQuery);
        mysqli_stmt_bind_param($stmt_update, "is", $quantity, $product_id);

        if (mysqli_stmt_execute($stmt_update)) {
            echo json_encode(["status" => "success", "message" => "Inventory updated successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update inventory."]);
        }

        mysqli_stmt_close($stmt_update);
    } else {
        // Product doesn't exist, insert it into the products table
        $insertQuery = "INSERT INTO products (product_id, product_name, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt_insert = mysqli_prepare($conn, $insertQuery);
        mysqli_stmt_bind_param($stmt_insert, "ssis", $product_id, $product_name, $quantity, $price);

        if (mysqli_stmt_execute($stmt_insert)) {
            echo json_encode(["status" => "success", "message" => "Product added to inventory."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add product to inventory."]);
        }

        mysqli_stmt_close($stmt_insert);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
?>
