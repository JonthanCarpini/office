<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['id'])) {
        sendError('ID da linha é obrigatório', 400);
    }
    
    $lineId = (int)$data['id'];
    
    // Verificar se linha existe
    $stmt = $db->prepare("SELECT id FROM `lines` WHERE id = ?");
    $stmt->execute([$lineId]);
    if (!$stmt->fetch()) {
        sendError('Linha não encontrada', 404);
    }
    
    // Preparar campos para atualização
    $fields = [];
    $values = [];
    
    if (isset($data['username'])) {
        $fields[] = "username = ?";
        $values[] = sanitizeInput($data['username']);
    }
    if (isset($data['password'])) {
        $fields[] = "password = ?";
        $values[] = sanitizeInput($data['password']);
    }
    if (isset($data['exp_date'])) {
        $fields[] = "exp_date = ?";
        $values[] = $data['exp_date'];
    }
    if (isset($data['admin_enabled'])) {
        $fields[] = "admin_enabled = ?";
        $values[] = $data['admin_enabled'];
    }
    if (isset($data['enabled'])) {
        $fields[] = "enabled = ?";
        $values[] = $data['enabled'];
    }
    if (isset($data['max_connections'])) {
        $fields[] = "max_connections = ?";
        $values[] = $data['max_connections'];
    }
    if (isset($data['is_trial'])) {
        $fields[] = "is_trial = ?";
        $values[] = $data['is_trial'];
    }
    if (isset($data['is_mag'])) {
        $fields[] = "is_mag = ?";
        $values[] = $data['is_mag'];
    }
    if (isset($data['is_e2'])) {
        $fields[] = "is_e2 = ?";
        $values[] = $data['is_e2'];
    }
    if (isset($data['admin_notes'])) {
        $fields[] = "admin_notes = ?";
        $values[] = $data['admin_notes'];
    }
    if (isset($data['bouquet'])) {
        $fields[] = "bouquet = ?";
        $values[] = $data['bouquet'];
    }
    if (isset($data['allowed_outputs'])) {
        $fields[] = "allowed_outputs = ?";
        $values[] = $data['allowed_outputs'];
    }
    
    if (empty($fields)) {
        sendError('Nenhum campo para atualizar', 400);
    }
    
    $values[] = $lineId;
    
    $sql = "UPDATE `lines` SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    sendResponse([
        'success' => true,
        'message' => 'Linha atualizada com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Update Line Error: " . $e->getMessage());
    sendError('Erro ao atualizar linha: ' . $e->getMessage(), 500);
}
?>
