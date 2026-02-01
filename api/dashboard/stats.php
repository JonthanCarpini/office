<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    // Total de usuários ativos
    $totalUsers = $db->query("SELECT COUNT(*) as count FROM users WHERE status = 1")->fetch()['count'];
    
    // Linhas ativas (não expiradas e habilitadas)
    $activeLines = $db->query("
        SELECT COUNT(*) as count FROM `lines` 
        WHERE admin_enabled = 1 AND enabled = 1 AND exp_date > " . time()
    )->fetch()['count'];
    
    // Linhas expiradas
    $expiredLines = $db->query("
        SELECT COUNT(*) as count FROM `lines` 
        WHERE exp_date <= " . time() . " AND exp_date > 0"
    )->fetch()['count'];
    
    // Conexões ativas em tempo real
    $activeConnections = $db->query("SELECT COUNT(*) as count FROM lines_live")->fetch()['count'];
    
    // Total de streams
    $totalStreams = $db->query("SELECT COUNT(*) as count FROM streams")->fetch()['count'];
    
    // Servidores online
    $onlineServers = $db->query("
        SELECT COUNT(*) as count FROM servers 
        WHERE status = 1 AND enabled = 1
    ")->fetch()['count'];
    
    // Total de dispositivos MAG
    $totalMAG = $db->query("SELECT COUNT(*) as count FROM mag_devices")->fetch()['count'];
    
    // Total de dispositivos Enigma2
    $totalEnigma2 = $db->query("SELECT COUNT(*) as count FROM enigma2_devices")->fetch()['count'];
    
    // Conexões nas últimas 24 horas (por hora)
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
    
    // Top 10 streams mais assistidos nas últimas 24h
    $topStreams = $db->query("
        SELECT 
            s.stream_display_name as name, 
            COUNT(la.activity_id) as views
        FROM streams s
        LEFT JOIN lines_activity la ON s.id = la.stream_id
        WHERE la.date_start >= " . (time() - 86400) . "
        GROUP BY s.id, s.stream_display_name
        ORDER BY views DESC
        LIMIT 10
    ")->fetchAll();
    
    // Atividades recentes
    $recentActivities = [];
    
    // Novas linhas criadas (últimas 10)
    $newLines = $db->query("
        SELECT username, created_at 
        FROM `lines` 
        WHERE created_at > 0
        ORDER BY created_at DESC 
        LIMIT 5
    ")->fetchAll();
    
    foreach ($newLines as $line) {
        $recentActivities[] = [
            'icon' => 'fa-plus-circle',
            'color' => 'green',
            'description' => 'Nova linha criada: ' . $line['username'],
            'time' => timeAgo($line['created_at'])
        ];
    }
    
    // Novos usuários (últimos 5)
    $newUsers = $db->query("
        SELECT username, date_registered 
        FROM users 
        WHERE date_registered > 0
        ORDER BY date_registered DESC 
        LIMIT 5
    ")->fetchAll();
    
    foreach ($newUsers as $newUser) {
        $recentActivities[] = [
            'icon' => 'fa-user-plus',
            'color' => 'blue',
            'description' => 'Novo usuário: ' . $newUser['username'],
            'time' => timeAgo($newUser['date_registered'])
        ];
    }
    
    // Ordenar por tempo
    usort($recentActivities, function($a, $b) {
        return strcmp($b['time'], $a['time']);
    });
    
    // Limitar a 10 atividades
    $recentActivities = array_slice($recentActivities, 0, 10);
    
    sendResponse([
        'total_users' => (int)$totalUsers,
        'active_lines' => (int)$activeLines,
        'expired_lines' => (int)$expiredLines,
        'active_connections' => (int)$activeConnections,
        'total_streams' => (int)$totalStreams,
        'online_servers' => (int)$onlineServers,
        'total_mag' => (int)$totalMAG,
        'total_enigma2' => (int)$totalEnigma2,
        'connections_data' => $connectionsData,
        'top_streams' => $topStreams,
        'recent_activities' => $recentActivities
    ]);
    
} catch (Exception $e) {
    error_log("Dashboard Stats Error: " . $e->getMessage());
    sendError('Failed to load statistics: ' . $e->getMessage(), 500);
}

function timeAgo($timestamp) {
    if (!$timestamp) return 'Nunca';
    
    $diff = time() - $timestamp;
    
    if ($diff < 60) return 'Agora mesmo';
    if ($diff < 3600) return floor($diff / 60) . ' minutos atrás';
    if ($diff < 86400) return floor($diff / 3600) . ' horas atrás';
    if ($diff < 604800) return floor($diff / 86400) . ' dias atrás';
    
    return date('d/m/Y H:i', $timestamp);
}
?>
