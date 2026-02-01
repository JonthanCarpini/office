<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 20;
    $offset = ($page - 1) * $perPage;
    
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $type = isset($_GET['type']) ? (int)$_GET['type'] : 0;
    
    $where = ['1=1'];
    $params = [];
    
    if (!empty($search)) {
        $where[] = "s.stream_display_name LIKE :search";
        $params['search'] = "%$search%";
    }
    
    if ($type > 0) {
        $where[] = "s.type = :type";
        $params['type'] = $type;
    }
    
    $whereClause = implode(' AND ', $where);
    
    $countStmt = $db->prepare("SELECT COUNT(*) as total FROM streams s WHERE $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $perPage);
    
    $stmt = $db->prepare("
        SELECT s.*, 
               sc.category_name,
               ss.stream_status,
               COUNT(DISTINCT la.id) as views
        FROM streams s
        LEFT JOIN streams_categories sc ON JSON_CONTAINS(s.category_id, CAST(sc.id AS CHAR))
        LEFT JOIN streams_servers ss ON s.id = ss.stream_id
        LEFT JOIN lines_activity la ON s.id = la.stream_id AND la.date_start >= " . (time() - 86400) . "
        WHERE $whereClause
        GROUP BY s.id
        ORDER BY s.id DESC
        LIMIT :limit OFFSET :offset
    ");
    
    foreach ($params as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $streams = $stmt->fetchAll();
    
    sendResponse([
        'streams' => $streams,
        'total' => (int)$total,
        'page' => $page,
        'per_page' => $perPage,
        'total_pages' => $totalPages
    ]);
    
} catch (Exception $e) {
    error_log("Streams List Error: " . $e->getMessage());
    sendError('Failed to load streams', 500);
}
?>
