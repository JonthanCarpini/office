<?php
require_once '../config.php';

$user = JWT::verify();
$data = getRequestData();

try {
    $db = Database::getInstance()->getConnection();
    
    if (empty($data['stream_display_name'])) {
        sendError('Nome do stream é obrigatório', 400);
    }
    
    $streamDisplayName = sanitizeInput($data['stream_display_name']);
    $type = $data['type'] ?? 1; // 1=Live TV, 2=Movie, 3=Series
    $categoryId = $data['category_id'] ?? '[]';
    $streamSource = $data['stream_source'] ?? '';
    $streamIcon = $data['stream_icon'] ?? '';
    $notes = $data['notes'] ?? '';
    $directSource = $data['direct_source'] ?? 0;
    $tvArchiveDuration = $data['tv_archive_duration'] ?? 0;
    $read_native = $data['read_native'] ?? 1;
    $transcode_profile_id = $data['transcode_profile_id'] ?? 0;
    
    $stmt = $db->prepare("
        INSERT INTO streams (
            type, category_id, stream_display_name, stream_source, stream_icon,
            notes, direct_source, tv_archive_duration, read_native, 
            transcode_profile_id, added
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $type, $categoryId, $streamDisplayName, $streamSource, $streamIcon,
        $notes, $directSource, $tvArchiveDuration, $read_native,
        $transcode_profile_id, time()
    ]);
    
    $streamId = $db->lastInsertId();
    
    sendResponse([
        'success' => true,
        'message' => 'Stream criado com sucesso',
        'stream_id' => $streamId
    ]);
    
} catch (Exception $e) {
    error_log("Create Stream Error: " . $e->getMessage());
    sendError('Erro ao criar stream: ' . $e->getMessage(), 500);
}
?>
