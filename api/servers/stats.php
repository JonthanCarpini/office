<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->query("
        SELECT 
            s.*,
            ss.cpu,
            ss.total_mem_used_percent,
            ss.connections,
            ss.time as last_check
        FROM servers s
        LEFT JOIN (
            SELECT server_id, cpu, total_mem_used_percent, connections, time,
                   ROW_NUMBER() OVER (PARTITION BY server_id ORDER BY time DESC) as rn
            FROM servers_stats
        ) ss ON s.id = ss.server_id AND ss.rn = 1
        ORDER BY s.id
    ");
    
    $servers = $stmt->fetchAll();
    
    foreach ($servers as &$server) {
        $server['status_text'] = $server['status'] == 1 ? 'Online' : 'Offline';
        $server['status_color'] = $server['status'] == 1 ? 'green' : 'red';
        
        $server['cpu_percent'] = $server['cpu'] ?? 0;
        $server['memory_percent'] = $server['total_mem_used_percent'] ?? 0;
        $server['active_connections'] = $server['connections'] ?? 0;
        
        $server['cpu_status'] = $server['cpu_percent'] > 80 ? 'danger' : ($server['cpu_percent'] > 60 ? 'warning' : 'ok');
        $server['memory_status'] = $server['memory_percent'] > 80 ? 'danger' : ($server['memory_percent'] > 60 ? 'warning' : 'ok');
    }
    
    sendResponse([
        'servers' => $servers
    ]);
    
} catch (Exception $e) {
    error_log("Server Stats Error: " . $e->getMessage());
    sendError('Failed to load server stats: ' . $e->getMessage(), 500);
}
?>
