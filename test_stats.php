<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testando queries do dashboard...\n\n";

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
    
    // Verificar estrutura da tabela lines_activity
    echo "1. Estrutura da tabela lines_activity:\n";
    $stmt = $pdo->query("DESCRIBE lines_activity");
    $columns = $stmt->fetchAll();
    foreach ($columns as $col) {
        echo "   - {$col['Field']} ({$col['Type']})\n";
    }
    echo "\n";
    
    // Testar query de total de usuários
    echo "2. Total de usuários ativos:\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM users WHERE status = 1")->fetch();
    echo "   ✓ {$result['count']} usuários\n\n";
    
    // Testar query de conexões ativas
    echo "3. Conexões ativas:\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM lines_live")->fetch();
    echo "   ✓ {$result['count']} conexões\n\n";
    
    // Testar query de streams
    echo "4. Total de streams:\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM streams")->fetch();
    echo "   ✓ {$result['count']} streams\n\n";
    
    // Testar query de servidores
    echo "5. Servidores online:\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM servers WHERE status = 1 AND enabled = 1")->fetch();
    echo "   ✓ {$result['count']} servidores\n\n";
    
    // Testar query problemática de top streams
    echo "6. Testando query de top streams:\n";
    try {
        $result = $pdo->query("
            SELECT s.stream_display_name as name, COUNT(la.activity_id) as views
            FROM streams s
            LEFT JOIN lines_activity la ON s.id = la.stream_id
            WHERE la.date_start >= " . (time() - 86400) . "
            GROUP BY s.id
            ORDER BY views DESC
            LIMIT 5
        ")->fetchAll();
        echo "   ✓ Query funcionou! " . count($result) . " resultados\n\n";
    } catch (Exception $e) {
        echo "   ✗ Erro na query: " . $e->getMessage() . "\n\n";
    }
    
    echo "Todas as verificações concluídas!\n";
    
} catch (PDOException $e) {
    echo "✗ Erro de conexão: " . $e->getMessage() . "\n";
}
?>
