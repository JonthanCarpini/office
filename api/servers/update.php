<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['id'])) {
        sendError('ID do servidor é obrigatório', 400);
    }
    
    $serverId = (int)$data['id'];
    
    $stmt = $db->prepare("SELECT id FROM servers WHERE id = ?");
    $stmt->execute([$serverId]);
    if (!$stmt->fetch()) {
        sendError('Servidor não encontrado', 404);
    }
    
    $fields = [];
    $values = [];
    
    if (isset($data['server_name'])) {
        $fields[] = "server_name = ?";
        $values[] = sanitizeInput($data['server_name']);
    }
    if (isset($data['server_ip'])) {
        $fields[] = "server_ip = ?";
        $values[] = sanitizeInput($data['server_ip']);
    }
    if (isset($data['status'])) {
        $fields[] = "status = ?";
        $values[] = $data['status'];
    }
    if (isset($data['enabled'])) {
        $fields[] = "enabled = ?";
        $values[] = $data['enabled'];
    }
    if (isset($data['server_type'])) {
        $fields[] = "server_type = ?";
        $values[] = $data['server_type'];
    }
    if (isset($data['rtmp_port'])) {
        $fields[] = "rtmp_port = ?";
        $values[] = $data['rtmp_port'];
    }
    if (isset($data['http_broadcast_port'])) {
        $fields[] = "http_broadcast_port = ?";
        $values[] = $data['http_broadcast_port'];
    }
    if (isset($data['https_broadcast_port'])) {
        $fields[] = "https_broadcast_port = ?";
        $values[] = $data['https_broadcast_port'];
    }
    if (isset($data['notes'])) {
        $fields[] = "notes = ?";
        $values[] = $data['notes'];
    }
    
    if (empty($fields)) {
        sendError('Nenhum campo para atualizar', 400);
    }
    
    $values[] = $serverId;
    
    $sql = "UPDATE servers SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    sendResponse([
        'success' => true,
        'message' => 'Servidor atualizado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Update Server Error: " . $e->getMessage());
    sendError('Erro ao atualizar servidor: ' . $e->getMessage(), 500);
}
?>
