<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getRequestData();

if (!isset($data['username']) || !isset($data['password'])) {
    sendError('Username and password are required');
}

$username = $data['username'];
$password = $data['password'];

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT u.*, ug.group_name, ug.is_admin, ug.is_reseller 
        FROM users u
        LEFT JOIN users_groups ug ON u.member_group_id = ug.group_id
        WHERE u.username = :username AND u.status = 1
        LIMIT 1
    ");
    
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendError('Invalid credentials', 401);
    }
    
    $updateStmt = $db->prepare("UPDATE users SET last_login = :time WHERE id = :id");
    $updateStmt->execute([
        'time' => time(),
        'id' => $user['id']
    ]);
    
    $payload = [
        'user_id' => $user['id'],
        'username' => $user['username'],
        'is_admin' => $user['is_admin'],
        'is_reseller' => $user['is_reseller'],
        'exp' => time() + JWT_EXPIRATION
    ];
    
    $token = JWT::encode($payload);
    
    sendResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'group_name' => $user['group_name'],
            'is_admin' => $user['is_admin'],
            'is_reseller' => $user['is_reseller'],
            'credits' => $user['credits']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    sendError('Authentication failed', 500);
}
?>
