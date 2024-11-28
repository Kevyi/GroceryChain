<?php
$host = 'localhost';
$dbname = 'cmpe_131';  // Database name
$user = 'root';         // Database username
$password = '';         // Database password

// Allow CORS and set content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate, max-age=0");

// Establish database connection
$conn = mysqli_connect($host, $user, $password, $dbname);

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()])); 
}

// Get JSON data from the request
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $query = "SELECT id AS product_id, Name AS product_name, Count AS quantity, Price AS price FROM products";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row; // Push each product data to the array
        }
        echo json_encode(["status" => "success", "data" => $products]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to fetch product data."]);
    }
    exit();
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $product_id = $data['product_id'];
    $quantity = $data['quantity'];

    if (!$product_id || !$quantity) {
        echo json_encode(["status" => "error", "message" => "Missing product_id or quantity."]);
        exit();
    }

    $updateQuery = "UPDATE products SET Count = Count + ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $updateQuery);
    mysqli_stmt_bind_param($stmt, "is", $quantity, $product_id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["status" => "success", "message" => "Stock updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update stock."]);
    }

    mysqli_stmt_close($stmt);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $query = "SELECT id AS product_id, Name AS product_name, Count AS quantity, Price AS price FROM products";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['availability'] = $row['quantity'] > 0 ? "In Stock" : "Out of Stock"; // Add availability dynamically
            $products[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $products]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to fetch product data."]);
    }
    exit();
}

mysqli_close($conn);
?>
