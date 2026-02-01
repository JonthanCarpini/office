<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 20;
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    
    $offset = ($page - 1) * $perPage;
    
    $where = ["1=1"];
    $params = [];
    
    if ($search) {
        $where[] = "s.stream_display_name LIKE ?";
        $params[] = "%$search%";
    }
    
    if ($type !== '') {
        $where[] = "s.type = ?";
        $params[] = $type;
    }
    
    $whereClause = implode(' AND ', $where);
    
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM streams s WHERE $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->prepare("
        SELECT 
            s.*,
            (SELECT COUNT(*) FROM streams_servers WHERE stream_id = s.id) as server_count,
            (SELECT COUNT(*) FROM lines_activity WHERE stream_id = s.id AND date_start >= " . (time() - 86400) . ") as views_24h,
            (SELECT COUNT(*) FROM lines_live WHERE stream_id = s.id) as active_viewers
        FROM streams s
        WHERE $whereClause
        ORDER BY s.id DESC
        LIMIT $perPage OFFSET $offset
    ");
    $stmt->execute($params);
    $streams = $stmt->fetchAll();
    
    foreach ($streams as &$stream) {
        $stream['type_text'] = $stream['type'] == 1 ? 'Live TV' : ($stream['type'] == 2 ? 'Movie' : 'Series');
    }
    
    sendResponse([
        'streams' => $streams,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List Streams Error: " . $e->getMessage());
    sendError('Failed to load streams: ' . $e->getMessage(), 500);
}
?>
