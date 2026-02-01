<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("SELECT * FROM settings LIMIT 1");
    $settings = $stmt->fetch();
    
    sendResponse([
        'settings' => $settings
    ]);
    
} catch (Exception $e) {
    error_log("Settings Error: " . $e->getMessage());
    sendError('Failed to load settings: ' . $e->getMessage(), 500);
}
?>
