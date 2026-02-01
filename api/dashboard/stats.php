<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $totalUsers = $db->query("SELECT COUNT(*) as count FROM users WHERE status = 1")->fetch()['count'];
    
    $activeConnections = $db->query("SELECT COUNT(*) as count FROM lines_live")->fetch()['count'];
    
    $totalStreams = $db->query("SELECT COUNT(*) as count FROM streams")->fetch()['count'];
    
    $onlineServers = $db->query("SELECT COUNT(*) as count FROM servers WHERE status = 1 AND enabled = 1")->fetch()['count'];
    
    $connectionsData = [];
    for ($i = 23; $i >= 0; $i--) {
        $hour = date('H:00', strtotime("-$i hours"));
        $startTime = strtotime("-$i hours");
        $endTime = strtotime("-" . ($i - 1) . " hours");
        
        $stmt = $db->prepare("
            SELECT COUNT(*) as count 
            FROM lines_activity 
            WHERE date_start >= :start AND date_start < :end
        ");
        $stmt->execute(['start' => $startTime, 'end' => $endTime]);
        $count = $stmt->fetch()['count'];
        
        $connectionsData[] = [
            'hour' => $hour,
            'count' => (int)$count
        ];
    }
    
    $topStreams = $db->query("
        SELECT s.stream_display_name as name, COUNT(la.id) as views
        FROM streams s
        LEFT JOIN lines_activity la ON s.id = la.stream_id
        WHERE la.date_start >= " . (time() - 86400) . "
        GROUP BY s.id
        ORDER BY views DESC
        LIMIT 5
    ")->fetchAll();
    
    sendResponse([
        'total_users' => (int)$totalUsers,
        'active_connections' => (int)$activeConnections,
        'total_streams' => (int)$totalStreams,
        'online_servers' => (int)$onlineServers,
        'connections_data' => $connectionsData,
        'top_streams' => $topStreams
    ]);
    
} catch (Exception $e) {
    error_log("Dashboard Stats Error: " . $e->getMessage());
    sendError('Failed to load statistics', 500);
}
?>
