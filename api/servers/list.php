<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("
        SELECT 
            s.*,
            (SELECT cpu FROM servers_stats WHERE server_id = s.id ORDER BY time DESC LIMIT 1) as cpu,
            (SELECT total_mem_used_percent FROM servers_stats WHERE server_id = s.id ORDER BY time DESC LIMIT 1) as memory_percent,
            (SELECT connections FROM servers_stats WHERE server_id = s.id ORDER BY time DESC LIMIT 1) as active_connections,
            (SELECT time FROM servers_stats WHERE server_id = s.id ORDER BY time DESC LIMIT 1) as last_check,
            (SELECT COUNT(*) FROM streams_servers WHERE server_id = s.id) as stream_count
        FROM servers s
        ORDER BY s.id
    ");
    
    $servers = $stmt->fetchAll();
    
    foreach ($servers as &$server) {
        $server['status_text'] = $server['status'] == 1 ? 'Online' : 'Offline';
        $server['status_color'] = $server['status'] == 1 ? 'green' : 'red';
        $server['enabled_text'] = $server['enabled'] == 1 ? 'Habilitado' : 'Desabilitado';
    }
    
    sendResponse([
        'servers' => $servers
    ]);
    
} catch (Exception $e) {
    error_log("List Servers Error: " . $e->getMessage());
    sendError('Failed to load servers: ' . $e->getMessage(), 500);
}
?>
