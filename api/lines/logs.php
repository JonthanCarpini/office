<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 50;
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    
    $offset = ($page - 1) * $perPage;
    
    $where = ["1=1"];
    $params = [];
    
    if ($search) {
        $where[] = "l.username LIKE ?";
        $params[] = "%$search%";
    }
    
    $whereClause = implode(' AND ', $where);
    
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM lines_logs ll LEFT JOIN `lines` l ON ll.user_id = l.id WHERE $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->prepare("
        SELECT 
            ll.*,
            l.username
        FROM lines_logs ll
        LEFT JOIN `lines` l ON ll.user_id = l.id
        WHERE $whereClause
        ORDER BY ll.date DESC
        LIMIT $perPage OFFSET $offset
    ");
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    // Processar logs
    foreach ($logs as &$log) {
        $log['type_text'] = ucfirst($log['type'] ?? 'info');
    }
    
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
    error_log("Lines Logs Error: " . $e->getMessage());
    sendError('Failed to load logs: ' . $e->getMessage(), 500);
}
?>
