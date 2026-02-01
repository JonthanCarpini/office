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
    
    $stmt = $db->prepare("DELETE FROM servers WHERE id = ?");
    $stmt->execute([$serverId]);
    
    $stmt = $db->prepare("DELETE FROM servers_stats WHERE server_id = ?");
    $stmt->execute([$serverId]);
    
    sendResponse([
        'success' => true,
        'message' => 'Servidor deletado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Delete Server Error: " . $e->getMessage());
    sendError('Erro ao deletar servidor: ' . $e->getMessage(), 500);
}
?>
