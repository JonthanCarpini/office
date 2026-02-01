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
    
    if ($userId == 1) {
        sendError('Não é possível deletar o usuário admin principal', 403);
    }
    
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch()) {
        sendError('Usuário não encontrado', 404);
    }
    
    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    sendResponse([
        'success' => true,
        'message' => 'Usuário deletado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Delete User Error: " . $e->getMessage());
    sendError('Erro ao deletar usuário: ' . $e->getMessage(), 500);
}
?>
