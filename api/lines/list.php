<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 20;
    $offset = ($page - 1) * $perPage;
    
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    
    $where = ['1=1'];
    $params = [];
    
    if (!empty($search)) {
        $where[] = "(l.username LIKE :search OR l.last_ip LIKE :search)";
        $params['search'] = "%$search%";
    }
    
    $now = time();
    if ($status === 'active') {
        $where[] = "l.admin_enabled = 1 AND l.enabled = 1 AND l.exp_date > $now";
    } elseif ($status === 'expired') {
        $where[] = "l.exp_date < $now";
    } elseif ($status === 'disabled') {
        $where[] = "(l.admin_enabled = 0 OR l.enabled = 0)";
    }
    
    $whereClause = implode(' AND ', $where);
    
    $countStmt = $db->prepare("SELECT COUNT(*) as total FROM `lines` l WHERE $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $perPage);
    
    $stmt = $db->prepare("
        SELECT l.*, u.username as owner_username
        FROM `lines` l
        LEFT JOIN users u ON l.member_id = u.id
        WHERE $whereClause
        ORDER BY l.id DESC
        LIMIT :limit OFFSET :offset
    ");
    
    foreach ($params as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $lines = $stmt->fetchAll();
    
    sendResponse([
        'lines' => $lines,
        'total' => (int)$total,
        'page' => $page,
        'per_page' => $perPage,
        'total_pages' => $totalPages
    ]);
    
} catch (Exception $e) {
    error_log("Lines List Error: " . $e->getMessage());
    sendError('Failed to load lines', 500);
}
?>
