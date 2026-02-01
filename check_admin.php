<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Verificando usuário admin no banco...\n\n";

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=iptv_database;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Buscar usuário admin
    $stmt = $pdo->prepare("SELECT id, username, email, member_group_id, status FROM users WHERE username = ?");
    $stmt->execute(['admin']);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "✓ Usuário admin encontrado!\n\n";
        echo "ID: " . $user['id'] . "\n";
        echo "Username: " . $user['username'] . "\n";
        echo "Email: " . $user['email'] . "\n";
        echo "Grupo: " . $user['member_group_id'] . "\n";
        echo "Status: " . ($user['status'] == 1 ? 'Ativo' : 'Inativo') . "\n\n";
        
        // Verificar se o grupo existe
        $stmt = $pdo->prepare("SELECT * FROM users_groups WHERE group_id = ?");
        $stmt->execute([$user['member_group_id']]);
        $group = $stmt->fetch();
        
        if ($group) {
            echo "✓ Grupo encontrado: " . $group['group_name'] . "\n";
            echo "  É admin: " . ($group['is_admin'] ? 'Sim' : 'Não') . "\n\n";
        } else {
            echo "✗ ERRO: Grupo não encontrado!\n\n";
        }
        
        // Gerar novo hash para a senha admin123
        $newHash = password_hash('admin123', PASSWORD_BCRYPT);
        echo "Novo hash gerado para senha 'admin123':\n";
        echo $newHash . "\n\n";
        
        echo "Deseja atualizar a senha? Execute:\n";
        echo "UPDATE users SET password = '$newHash' WHERE username = 'admin';\n\n";
        
    } else {
        echo "✗ Usuário admin NÃO encontrado!\n\n";
        echo "Execute o script create_admin.sql para criar o usuário.\n\n";
        
        // Gerar hash para criar o usuário
        $hash = password_hash('admin123', PASSWORD_BCRYPT);
        echo "Use este SQL para criar o usuário admin:\n\n";
        echo "INSERT INTO users (username, password, email, member_group_id, status, date_registered, credits)\n";
        echo "VALUES ('admin', '$hash', 'admin@localhost.com', 1, 1, UNIX_TIMESTAMP(), 999999.00);\n\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Erro: " . $e->getMessage() . "\n";
}
?>
