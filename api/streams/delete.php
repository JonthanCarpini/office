<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['id'])) {
        sendError('ID do stream é obrigatório', 400);
    }
    
    $streamId = (int)$data['id'];
    
    $stmt = $db->prepare("SELECT id FROM streams WHERE id = ?");
    $stmt->execute([$streamId]);
    if (!$stmt->fetch()) {
        sendError('Stream não encontrado', 404);
    }
    
    $stmt = $db->prepare("DELETE FROM streams WHERE id = ?");
    $stmt->execute([$streamId]);
    
    // Deletar dados relacionados
    $stmt = $db->prepare("DELETE FROM streams_servers WHERE stream_id = ?");
    $stmt->execute([$streamId]);
    
    $stmt = $db->prepare("DELETE FROM streams_options WHERE stream_id = ?");
    $stmt->execute([$streamId]);
    
    sendResponse([
        'success' => true,
        'message' => 'Stream deletado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Delete Stream Error: " . $e->getMessage());
    sendError('Erro ao deletar stream: ' . $e->getMessage(), 500);
}
?>
