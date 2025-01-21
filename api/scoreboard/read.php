<?php
header('Content-Type: application/json');

include_once '../../system/config.php';

// Start session and check authentication
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized - Please login first']);
    exit();
}

try {
    // Get total score for each user by summing up task scores
    $query = "SELECT u.id, u.name, COALESCE(SUM(t.score), 0) as total_score 
              FROM users u 
              LEFT JOIN user_has_task uht ON u.id = uht.user_id 
              LEFT JOIN tasks t ON uht.task_id = t.id 
              WHERE u.id = ?
              GROUP BY u.id, u.name";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$_SESSION['user_id']]);
    
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($scores);
} catch(PDOException $e) {
    echo json_encode([
        'error' => 'Error fetching scores: ' . $e->getMessage()
    ]);
}
?>