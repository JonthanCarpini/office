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
    
    $fields = [];
    $values = [];
    
    if (isset($data['stream_display_name'])) {
        $fields[] = "stream_display_name = ?";
        $values[] = sanitizeInput($data['stream_display_name']);
    }
    if (isset($data['type'])) {
        $fields[] = "type = ?";
        $values[] = $data['type'];
    }
    if (isset($data['category_id'])) {
        $fields[] = "category_id = ?";
        $values[] = $data['category_id'];
    }
    if (isset($data['stream_source'])) {
        $fields[] = "stream_source = ?";
        $values[] = $data['stream_source'];
    }
    if (isset($data['stream_icon'])) {
        $fields[] = "stream_icon = ?";
        $values[] = $data['stream_icon'];
    }
    if (isset($data['notes'])) {
        $fields[] = "notes = ?";
        $values[] = $data['notes'];
    }
    if (isset($data['direct_source'])) {
        $fields[] = "direct_source = ?";
        $values[] = $data['direct_source'];
    }
    if (isset($data['tv_archive_duration'])) {
        $fields[] = "tv_archive_duration = ?";
        $values[] = $data['tv_archive_duration'];
    }
    if (isset($data['read_native'])) {
        $fields[] = "read_native = ?";
        $values[] = $data['read_native'];
    }
    if (isset($data['transcode_profile_id'])) {
        $fields[] = "transcode_profile_id = ?";
        $values[] = $data['transcode_profile_id'];
    }
    
    if (empty($fields)) {
        sendError('Nenhum campo para atualizar', 400);
    }
    
    $values[] = $streamId;
    
    $sql = "UPDATE streams SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    sendResponse([
        'success' => true,
        'message' => 'Stream atualizado com sucesso'
    ]);
    
} catch (Exception $e) {
    error_log("Update Stream Error: " . $e->getMessage());
    sendError('Erro ao atualizar stream: ' . $e->getMessage(), 500);
}
?>
