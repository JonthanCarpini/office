<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['server_name']) || empty($data['server_ip'])) {
        sendError('Nome e IP do servidor são obrigatórios', 400);
    }
    
    $serverName = sanitizeInput($data['server_name']);
    $serverIp = sanitizeInput($data['server_ip']);
    $status = $data['status'] ?? 1;
    $enabled = $data['enabled'] ?? 1;
    $server_type = $data['server_type'] ?? 'main';
    $rtmp_port = $data['rtmp_port'] ?? 1935;
    $http_broadcast_port = $data['http_broadcast_port'] ?? 25461;
    $https_broadcast_port = $data['https_broadcast_port'] ?? 25463;
    $api_port = $data['api_port'] ?? 8000;
    $ssh_port = $data['ssh_port'] ?? 22;
    $whitelist_ips = $data['whitelist_ips'] ?? '';
    $notes = $data['notes'] ?? '';
    
    $stmt = $db->prepare("
        INSERT INTO servers (
            server_name, server_ip, status, enabled, server_type,
            rtmp_port, http_broadcast_port, https_broadcast_port,
            api_port, ssh_port, whitelist_ips, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $serverName, $serverIp, $status, $enabled, $server_type,
        $rtmp_port, $http_broadcast_port, $https_broadcast_port,
        $api_port, $ssh_port, $whitelist_ips, $notes
    ]);
    
    $serverId = $db->lastInsertId();
    
    sendResponse([
        'success' => true,
        'message' => 'Servidor criado com sucesso',
        'server_id' => $serverId
    ]);
    
} catch (Exception $e) {
    error_log("Create Server Error: " . $e->getMessage());
    sendError('Erro ao criar servidor: ' . $e->getMessage(), 500);
}
?>
