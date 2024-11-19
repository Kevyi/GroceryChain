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
    // Validate input fields
    if (
        empty($data['username']) || empty($data['password']) ||
        empty($data['email']) || empty($data['date_of_birth']) || empty($data['country'])
    ) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }

    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];
    $date_of_birth = $data['date_of_birth'];
    $country = $data['country'];

    // Check for duplicate username or email
    $checkQuery = "SELECT * FROM loginregister WHERE username = ? OR email = ?";
    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "ss", $username, $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(["status" => "error", "message" => "Username or email already exists."]);
        mysqli_stmt_close($stmt);
        exit();
    }
    mysqli_stmt_close($stmt);

    // Insert new user into the database
    $query = "INSERT INTO loginregister (username, email, password, date_of_birth, country) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sssss", $username, $email, $password, $date_of_birth, $country);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["status" => "success", "message" => "Registration successful."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to register. Please try again."]);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
?>
