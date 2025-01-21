<?php
// protected.php
require_once '../middleware/auth.php';
checkAuth();

header('Content-Type: application/json');

// Authorized — return user info
$response = [
    "email" => $_SESSION['email'],
    "message" => "You have access"
];
echo json_encode($response);