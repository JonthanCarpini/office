<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testando conexão com banco de dados...\n\n";

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
    
    echo "✓ Conexão com banco estabelecida!\n\n";
    
    // Verificar se a tabela users existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✓ Tabela 'users' encontrada!\n\n";
        
        // Verificar se existe algum usuário
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch();
        echo "Total de usuários: " . $result['total'] . "\n\n";
        
        // Verificar se a tabela users_groups existe
        $stmt = $pdo->query("SHOW TABLES LIKE 'users_groups'");
        if ($stmt->rowCount() > 0) {
            echo "✓ Tabela 'users_groups' encontrada!\n\n";
        } else {
            echo "✗ Tabela 'users_groups' NÃO encontrada!\n";
            echo "Execute o script create_admin.sql\n\n";
        }
        
    } else {
        echo "✗ Tabela 'users' NÃO encontrada!\n";
        echo "Você precisa importar o car.sql primeiro!\n\n";
    }
    
} catch (PDOException $e) {
    echo "✗ Erro de conexão: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "O banco 'iptv_database' não existe!\n";
        echo "Você precisa importar o car.sql no phpMyAdmin.\n\n";
    }
}
?>
