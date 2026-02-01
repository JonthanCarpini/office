<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 50;
    $offset = ($page - 1) * $perPage;
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM detect_restream_logs");
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->query("
        SELECT 
            drl.*,
            l.username
        FROM detect_restream_logs drl
        LEFT JOIN `lines` l ON drl.user_id = l.id
        ORDER BY drl.id DESC 
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
    error_log("Detect Restream Error: " . $e->getMessage());
    sendError('Failed to load restream detection: ' . $e->getMessage(), 500);
}
?>
