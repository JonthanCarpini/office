<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 100;
    $offset = ($page - 1) * $perPage;
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM panel_logs");
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->query("
        SELECT 
            pl.*,
            u.username
        FROM panel_logs pl
        LEFT JOIN users u ON pl.user_id = u.id
        ORDER BY pl.date DESC 
        LIMIT $perPage OFFSET $offset
    ");
    $logs = $stmt->fetchAll();
    
    sendResponse([
        'logs' => $logs,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Panel Logs Error: " . $e->getMessage());
    sendError('Failed to load panel logs: ' . $e->getMessage(), 500);
}
?>
