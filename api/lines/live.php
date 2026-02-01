<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("
        SELECT 
            ll.*,
            l.username,
            s.stream_display_name as stream_name,
            srv.server_name
        FROM lines_live ll
        LEFT JOIN `lines` l ON ll.user_id = l.id
        LEFT JOIN streams s ON ll.stream_id = s.id
        LEFT JOIN servers srv ON ll.server_id = srv.id
        ORDER BY ll.date_start DESC
    ");
    
    $connections = $stmt->fetchAll();
    
    sendResponse([
        'connections' => $connections,
        'total' => count($connections)
    ]);
    
} catch (Exception $e) {
    error_log("Lines Live Error: " . $e->getMessage());
    sendError('Failed to load live connections: ' . $e->getMessage(), 500);
}
?>
