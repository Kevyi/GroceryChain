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
    if (empty($data['username']) || empty($data['password'])) {
        echo json_encode(["status" => "fail", "message" => "Username and password are required."]);
        exit();
    }

    $username = $data['username'];
    $password = $data['password'];
    $isAdmin = isset($data['isAdmin']) && $data['isAdmin'] === true;

    // Determine the table based on admin flag
    $table = $isAdmin ? 'adminaccount' : 'loginregister';

    // Prepare SQL query to fetch the password
    $query = "SELECT password FROM $table WHERE username = ?";
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

        // Compare passwords directly (no hashing)
        if ($password === $dbPassword) {
            $message = $isAdmin ? "Admin login successful" : "User login successful";
            echo json_encode([
                "status" => "success",
                "message" => $message,
                "isAdmin" => $isAdmin // Send isAdmin to frontend
            ]);
        } else {
            echo json_encode(["status" => "fail", "message" => "Incorrect password."]);
        }
    } else {
        $message = $isAdmin ? "Admin not found." : "User not found.";
        echo json_encode(["status" => "fail", "message" => $message]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
?>
