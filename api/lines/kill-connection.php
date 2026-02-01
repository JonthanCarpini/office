<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['activity_id'])) {
        sendError('Activity ID é obrigatório', 400);
    }
    
    $activityId = (int)$data['activity_id'];
    
    // Deletar conexão ativa
    $stmt = $db->prepare("DELETE FROM lines_live WHERE activity_id = ?");
    $stmt->execute([$activityId]);
    
    // Atualizar data de fim na atividade
    $stmt = $db->prepare("UPDATE lines_activity SET date_end = ? WHERE activity_id = ?");
    $stmt->execute([time(), $activityId]);
    
    sendResponse([
        'success' => true,
        'message' => 'Conexão encerrada com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Kill Connection Error: " . $e->getMessage());
    sendError('Erro ao encerrar conexão: ' . $e->getMessage(), 500);
}
?>
