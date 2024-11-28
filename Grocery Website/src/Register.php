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
    $isAdmin = isset($data['isAdmin']) && $data['isAdmin'] === true;

    // Determine the target table based on the admin flag
    $table = $isAdmin ? 'adminaccount' : 'loginregister';

    // Debugging: Check the input data and table
    error_log("Debug: Username: $username, isAdmin: " . ($isAdmin ? "true" : "false"));
    error_log("Debug: Target table: $table");

    // Check for duplicate username or email in the appropriate table
    $checkQuery = "SELECT * FROM $table WHERE username = ? OR email = ?";
    $stmt = mysqli_prepare($conn, $checkQuery);
    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => "SQL error: " . mysqli_error($conn)]));
    }

    mysqli_stmt_bind_param($stmt, "ss", $username, $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(["status" => "error", "message" => "Username or email already exists."]);
        mysqli_stmt_close($stmt);
        exit();
    }
    mysqli_stmt_close($stmt);

    // Insert new user or admin into the selected table
    $query = "INSERT INTO $table (username, email, password, date_of_birth, country) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);

    if ($stmt === false) {
        die(json_encode(["status" => "error", "message" => "SQL prepare error: " . mysqli_error($conn)]));
    }

    mysqli_stmt_bind_param($stmt, "sssss", $username, $email, $password, $date_of_birth, $country);

    if (mysqli_stmt_execute($stmt)) {
        $message = $isAdmin ? "Admin registration successful." : "User registration successful.";
        echo json_encode(["status" => "success", "message" => $message]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to register: " . mysqli_error($conn)]);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

mysqli_close($conn);
?>
