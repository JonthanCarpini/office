<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 50;
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $dateStart = isset($_GET['date_start']) ? strtotime($_GET['date_start']) : 0;
    $dateEnd = isset($_GET['date_end']) ? strtotime($_GET['date_end'] . ' 23:59:59') : 0;
    
    $offset = ($page - 1) * $perPage;
    
    $where = ["1=1"];
    $params = [];
    
    if ($search) {
        $where[] = "l.username LIKE ?";
        $params[] = "%$search%";
    }
    
    if ($dateStart > 0) {
        $where[] = "la.date_start >= ?";
        $params[] = $dateStart;
    }
    
    if ($dateEnd > 0) {
        $where[] = "la.date_start <= ?";
        $params[] = $dateEnd;
    }
    
    $whereClause = implode(' AND ', $where);
    
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM lines_activity la LEFT JOIN `lines` l ON la.user_id = l.id WHERE $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->prepare("
        SELECT 
            la.*,
            l.username,
            s.stream_display_name as stream_name
        FROM lines_activity la
        LEFT JOIN `lines` l ON la.user_id = l.id
        LEFT JOIN streams s ON la.stream_id = s.id
        WHERE $whereClause
        ORDER BY la.date_start DESC
        LIMIT $perPage OFFSET $offset
    ");
    $stmt->execute($params);
    $activities = $stmt->fetchAll();
    
    sendResponse([
        'activities' => $activities,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Lines Activity Error: " . $e->getMessage());
    sendError('Failed to load activities: ' . $e->getMessage(), 500);
}
?>
