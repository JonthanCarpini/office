<?php
require_once '../config.php';

$user = JWT::verify();

try {
    $db = Database::getInstance()->getConnection();
    
    $activities = [];
    
    $recentUsers = $db->query("
        SELECT username, date_registered 
        FROM users 
        ORDER BY date_registered DESC 
        LIMIT 5
    ")->fetchAll();
    
    foreach ($recentUsers as $u) {
        $timeAgo = timeAgo($u['date_registered']);
        $activities[] = [
            'icon' => 'user-plus',
            'color' => 'blue',
            'title' => 'Novo usuário cadastrado',
            'description' => $u['username'],
            'time' => $timeAgo
        ];
    }
    
    $recentLines = $db->query("
        SELECT username, created_at 
        FROM `lines` 
        ORDER BY created_at DESC 
        LIMIT 5
    ")->fetchAll();
    
    foreach ($recentLines as $line) {
        $timeAgo = timeAgo($line['created_at']);
        $activities[] = [
            'icon' => 'user-tag',
            'color' => 'green',
            'title' => 'Nova linha criada',
            'description' => $line['username'],
            'time' => $timeAgo
        ];
    }
    
    usort($activities, function($a, $b) {
        return strcmp($b['time'], $a['time']);
    });
    
    sendResponse(array_slice($activities, 0, 10));
    
} catch (Exception $e) {
    error_log("Dashboard Activities Error: " . $e->getMessage());
    sendError('Failed to load activities', 500);
}

function timeAgo($timestamp) {
    $diff = time() - $timestamp;
    
    if ($diff < 60) {
        return 'há ' . $diff . ' segundos';
    } elseif ($diff < 3600) {
        return 'há ' . floor($diff / 60) . ' minutos';
    } elseif ($diff < 86400) {
        return 'há ' . floor($diff / 3600) . ' horas';
    } else {
        return 'há ' . floor($diff / 86400) . ' dias';
    }
}
?>
