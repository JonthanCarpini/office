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
    
    // Deletar linha
    $stmt = $db->prepare("DELETE FROM `lines` WHERE id = ?");
    $stmt->execute([$lineId]);
    
    // Deletar conexões ativas relacionadas
    $stmt = $db->prepare("DELETE FROM lines_live WHERE user_id = ?");
    $stmt->execute([$lineId]);
    
    sendResponse([
        'success' => true,
        'message' => 'Linha deletada com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Delete Line Error: " . $e->getMessage());
    sendError('Erro ao deletar linha: ' . $e->getMessage(), 500);
}
?>
