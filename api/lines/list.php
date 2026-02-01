<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 20;
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    
    $offset = ($page - 1) * $perPage;
    
    $where = ["1=1"];
    $params = [];
    
    if ($search) {
        $where[] = "(l.username LIKE ? OR l.last_ip LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($status === 'active') {
        $where[] = "l.admin_enabled = 1 AND l.enabled = 1 AND l.exp_date > " . time();
    } elseif ($status === 'expired') {
        $where[] = "l.exp_date <= " . time() . " AND l.exp_date > 0";
    } elseif ($status === 'disabled') {
        $where[] = "(l.admin_enabled = 0 OR l.enabled = 0)";
    } elseif ($status === 'trial') {
        $where[] = "l.is_trial = 1";
    }
    
    $whereClause = implode(' AND ', $where);
    
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM `lines` l WHERE $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->prepare("
        SELECT 
            l.*,
            u.username as owner_username,
            (SELECT COUNT(*) FROM lines_live WHERE user_id = l.id) as active_connections,
            (SELECT COUNT(*) FROM lines_activity WHERE user_id = l.id AND date_start >= " . (time() - 86400) . ") as connections_24h
        FROM `lines` l
        LEFT JOIN users u ON l.member_id = u.id
        WHERE $whereClause
        ORDER BY l.id DESC
        LIMIT $perPage OFFSET $offset
    ");
    $stmt->execute($params);
    $lines = $stmt->fetchAll();
    
    // Processar dados
    foreach ($lines as &$line) {
        $line['status_text'] = 'Ativa';
        $line['status_color'] = 'green';
        
        if ($line['exp_date'] <= time() && $line['exp_date'] > 0) {
            $line['status_text'] = 'Expirada';
            $line['status_color'] = 'red';
        } elseif ($line['admin_enabled'] == 0 || $line['enabled'] == 0) {
            $line['status_text'] = 'Desabilitada';
            $line['status_color'] = 'gray';
        } elseif ($line['is_trial'] == 1) {
            $line['status_text'] = 'Trial';
            $line['status_color'] = 'yellow';
        }
        
        $line['days_remaining'] = $line['exp_date'] > time() ? 
            floor(($line['exp_date'] - time()) / 86400) : 0;
    }
    
    sendResponse([
        'lines' => $lines,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List Lines Error: " . $e->getMessage());
    sendError('Failed to load lines: ' . $e->getMessage(), 500);
}
?>
