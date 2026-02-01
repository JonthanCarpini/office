<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("SELECT * FROM bouquets ORDER BY id DESC");
    $bouquets = $stmt->fetchAll();
    
    sendResponse([
        'bouquets' => $bouquets
    ]);
    
} catch (Exception $e) {
    error_log("List Bouquets Error: " . $e->getMessage());
    sendError('Failed to load bouquets: ' . $e->getMessage(), 500);
}
?>
