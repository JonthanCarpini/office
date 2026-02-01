<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 20;
    $offset = ($page - 1) * $perPage;
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM mag_devices");
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->query("
        SELECT 
            md.*,
            l.username as line_username
        FROM mag_devices md
        LEFT JOIN `lines` l ON md.user_id = l.id
        ORDER BY md.mag_id DESC
        LIMIT $perPage OFFSET $offset
    ");
    $devices = $stmt->fetchAll();
    
    sendResponse([
        'devices' => $devices,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List MAG Devices Error: " . $e->getMessage());
    sendError('Failed to load MAG devices: ' . $e->getMessage(), 500);
}
?>
