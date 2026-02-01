<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 20;
    $offset = ($page - 1) * $perPage;
    
    $stmt = $db->query("SELECT COUNT(*) as total FROM epg");
    $total = $stmt->fetch()['total'];
    
    $stmt = $db->query("
        SELECT * FROM epg 
        ORDER BY id DESC 
        LIMIT $perPage OFFSET $offset
    ");
    $epgs = $stmt->fetchAll();
    
    sendResponse([
        'epgs' => $epgs,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => (int)$total,
            'total_pages' => ceil($total / $perPage)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("List EPG Error: " . $e->getMessage());
    sendError('Failed to load EPG: ' . $e->getMessage(), 500);
}
?>
