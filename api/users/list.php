<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 20;
    $offset = ($page - 1) * $perPage;
    
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $group = isset($_GET['group']) ? (int)$_GET['group'] : 0;
    
    $where = ['1=1'];
    $params = [];
    
    if (!empty($search)) {
        $where[] = "(u.username LIKE :search OR u.email LIKE :search)";
        $params['search'] = "%$search%";
    }
    
    if ($group > 0) {
        $where[] = "u.member_group_id = :group";
        $params['group'] = $group;
    }
    
    $whereClause = implode(' AND ', $where);
    
    $countStmt = $db->prepare("SELECT COUNT(*) as total FROM users u WHERE $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    $totalPages = ceil($total / $perPage);
    
    $stmt = $db->prepare("
        SELECT u.*, ug.group_name
        FROM users u
        LEFT JOIN users_groups ug ON u.member_group_id = ug.group_id
        WHERE $whereClause
        ORDER BY u.id DESC
        LIMIT :limit OFFSET :offset
    ");
    
    foreach ($params as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    sendResponse([
        'users' => $users,
        'total' => (int)$total,
        'page' => $page,
        'per_page' => $perPage,
        'total_pages' => $totalPages
    ]);
    
} catch (Exception $e) {
    error_log("Users List Error: " . $e->getMessage());
    sendError('Failed to load users', 500);
}
?>
