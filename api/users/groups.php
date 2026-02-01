<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("SELECT * FROM users_groups ORDER BY group_id");
    $groups = $stmt->fetchAll();
    
    sendResponse([
        'groups' => $groups
    ]);
    
} catch (Exception $e) {
    error_log("List Groups Error: " . $e->getMessage());
    sendError('Failed to load groups: ' . $e->getMessage(), 500);
}
?>
