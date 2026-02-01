<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 50;
    $offset = ($page - 1) * $perPage;
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM blocked_ips");
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->query("
        SELECT * FROM blocked_ips 
        ORDER BY id DESC 
        LIMIT $perPage OFFSET $offset
    ");
    $blocked = $stmt->fetchAll();
    
    sendResponse([
        'blocked_ips' => $blocked,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List Blocked IPs Error: " . $e->getMessage());
    sendError('Failed to load blocked IPs: ' . $e->getMessage(), 500);
}
?>
