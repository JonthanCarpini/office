<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("
        SELECT s.*,
               ss.cpu,
               ss.total_mem_used_percent as memory,
               ss.connections
        FROM servers s
        LEFT JOIN (
            SELECT server_id, cpu, total_mem_used_percent, connections
            FROM servers_stats
            WHERE (server_id, time) IN (
                SELECT server_id, MAX(time)
                FROM servers_stats
                GROUP BY server_id
            )
        ) ss ON s.id = ss.server_id
        ORDER BY s.id ASC
    ");
    
    $servers = $stmt->fetchAll();
    
    sendResponse([
        'servers' => $servers
    ]);
    
} catch (Exception $e) {
    error_log("Servers List Error: " . $e->getMessage());
    sendError('Failed to load servers', 500);
}
?>
