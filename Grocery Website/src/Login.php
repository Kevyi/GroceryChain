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
    if (empty($data['username']) || empty($data['password'])) {
        echo json_encode(["status" => "fail", "message" => "Empty field detected. Please enter both username and password."]);
        exit();
    }

    $username = $data['username'];
    $password = $data['password'];

    // Fetch plain text password from database
    $query = "SELECT password FROM loginregister WHERE username = ?";
    $stmt = mysqli_prepare($conn, $query);

    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => "SQL error: " . mysqli_error($conn)]));
    }

    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        mysqli_stmt_bind_result($stmt, $dbPassword);
        mysqli_stmt_fetch($stmt);

        // Debugging: Log the fetched password and input password
        error_log("Debug: Fetched password from DB: " . $dbPassword);
        error_log("Debug: Input password: " . $password);

        // Compare passwords directly (no hashing)
        if ($password === $dbPassword) {
            echo json_encode(["status" => "success", "message" => "Login successful"]);
        } else {
            echo json_encode(["status" => "fail", "message" => "Incorrect password"]);
        }
    } else {
        echo json_encode(["status" => "fail", "message" => "User not found"]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}

mysqli_close($conn);
?>