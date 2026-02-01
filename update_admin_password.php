<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Atualizando senha do usuário admin...\n\n";

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
    
    // Gerar novo hash para a senha admin123
    $newHash = password_hash('admin123', PASSWORD_BCRYPT);
    
    // Atualizar a senha
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = 'admin'");
    $stmt->execute([$newHash]);
    
    echo "✓ Senha atualizada com sucesso!\n\n";
    echo "Credenciais:\n";
    echo "Usuário: admin\n";
    echo "Senha: admin123\n\n";
    
    // Verificar se funcionou
    $stmt = $pdo->prepare("SELECT password FROM users WHERE username = 'admin'");
    $stmt->execute();
    $user = $stmt->fetch();
    
    // Testar a senha
    if (password_verify('admin123', $user['password'])) {
        echo "✓ Verificação de senha OK!\n";
        echo "Agora você pode fazer login no painel.\n\n";
    } else {
        echo "✗ ERRO: Verificação de senha falhou!\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Erro: " . $e->getMessage() . "\n";
}
?>
