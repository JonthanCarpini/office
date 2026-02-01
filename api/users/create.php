<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['username']) || empty($data['password'])) {
        sendError('Username e password são obrigatórios', 400);
    }
    
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    if ($stmt->fetch()) {
        sendError('Username já existe', 400);
    }
    
    $username = sanitizeInput($data['username']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $email = sanitizeInput($data['email'] ?? '');
    $member_group_id = $data['member_group_id'] ?? 2;
    $status = $data['status'] ?? 1;
    $credits = $data['credits'] ?? 0;
    $notes = $data['notes'] ?? '';
    
    $stmt = $db->prepare("
        INSERT INTO users (
            username, password, email, member_group_id, status,
            credits, notes, date_registered
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $username, $password, $email, $member_group_id, $status,
        $credits, $notes, time()
    ]);
    
    $userId = $db->lastInsertId();
    
    sendResponse([
        'success' => true,
        'message' => 'Usuário criado com sucesso',
        'user_id' => $userId
    ]);
    
} catch (Exception $e) {
    error_log("Create User Error: " . $e->getMessage());
    sendError('Erro ao criar usuário: ' . $e->getMessage(), 500);
}
?>
