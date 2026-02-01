<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['id'])) {
        sendError('ID do usuário é obrigatório', 400);
    }
    
    $userId = (int)$data['id'];
    
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch()) {
        sendError('Usuário não encontrado', 404);
    }
    
    $fields = [];
    $values = [];
    
    if (isset($data['username'])) {
        $fields[] = "username = ?";
        $values[] = sanitizeInput($data['username']);
    }
    if (isset($data['password']) && !empty($data['password'])) {
        $fields[] = "password = ?";
        $values[] = password_hash($data['password'], PASSWORD_BCRYPT);
    }
    if (isset($data['email'])) {
        $fields[] = "email = ?";
        $values[] = sanitizeInput($data['email']);
    }
    if (isset($data['member_group_id'])) {
        $fields[] = "member_group_id = ?";
        $values[] = $data['member_group_id'];
    }
    if (isset($data['status'])) {
        $fields[] = "status = ?";
        $values[] = $data['status'];
    }
    if (isset($data['credits'])) {
        $fields[] = "credits = ?";
        $values[] = $data['credits'];
    }
    if (isset($data['notes'])) {
        $fields[] = "notes = ?";
        $values[] = $data['notes'];
    }
    
    if (empty($fields)) {
        sendError('Nenhum campo para atualizar', 400);
    }
    
    $values[] = $userId;
    
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    sendResponse([
        'success' => true,
        'message' => 'Usuário atualizado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Update User Error: " . $e->getMessage());
    sendError('Erro ao atualizar usuário: ' . $e->getMessage(), 500);
}
?>
