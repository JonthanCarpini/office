<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    // Validar campos obrigatórios
    if (empty($data['username']) || empty($data['password'])) {
        sendError('Username e password são obrigatórios', 400);
    }
    
    // Verificar se username já existe
    $stmt = $db->prepare("SELECT id FROM `lines` WHERE username = ?");
    $stmt->execute([$data['username']]);
    if ($stmt->fetch()) {
        sendError('Username já existe', 400);
    }
    
    // Preparar dados
    $username = sanitizeInput($data['username']);
    $password = sanitizeInput($data['password']);
    $member_id = $data['member_id'] ?? $user['id'];
    $exp_date = $data['exp_date'] ?? (time() + (30 * 86400)); // 30 dias padrão
    $max_connections = $data['max_connections'] ?? 1;
    $admin_enabled = $data['admin_enabled'] ?? 1;
    $enabled = $data['enabled'] ?? 1;
    $is_trial = $data['is_trial'] ?? 0;
    $is_mag = $data['is_mag'] ?? 0;
    $is_e2 = $data['is_e2'] ?? 0;
    $admin_notes = $data['admin_notes'] ?? '';
    $bouquet = $data['bouquet'] ?? '[]';
    $allowed_outputs = $data['allowed_outputs'] ?? '[]';
    
    // Inserir linha
    $stmt = $db->prepare("
        INSERT INTO `lines` (
            member_id, username, password, exp_date, admin_enabled, enabled,
            max_connections, is_trial, is_mag, is_e2, admin_notes,
            bouquet, allowed_outputs, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $member_id, $username, $password, $exp_date, $admin_enabled, $enabled,
        $max_connections, $is_trial, $is_mag, $is_e2, $admin_notes,
        $bouquet, $allowed_outputs, time()
    ]);
    
    $lineId = $db->lastInsertId();
    
    sendResponse([
        'success' => true,
        'message' => 'Linha criada com sucesso',
        'line_id' => $lineId
    ]);
    
} catch (Exception $e) {
    error_log("Create Line Error: " . $e->getMessage());
    sendError('Erro ao criar linha: ' . $e->getMessage(), 500);
}
?>
