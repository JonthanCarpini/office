<?php
/**
 * Arquivo de Configuração de Exemplo
 * 
 * Copie este arquivo para api/config.php e configure com suas credenciais
 */

// Configurações do Banco de Dados
define('DB_HOST', 'localhost');           // Host do banco de dados
define('DB_USER', 'seu_usuario');         // Usuário do banco
define('DB_PASS', 'sua_senha');           // Senha do banco
define('DB_NAME', 'iptv_database');       // Nome do banco de dados
define('DB_PORT', '3306');                // Porta do MySQL (padrão: 3306)

// Configurações de Segurança
define('JWT_SECRET', 'ALTERE_ESTA_CHAVE_SECRETA_PARA_ALGO_UNICO_E_SEGURO');
define('JWT_EXPIRATION', 86400);          // Tempo de expiração do token em segundos (24 horas)

// Configurações do Sistema
define('SYSTEM_NAME', 'Painel IPTV Office');
define('SYSTEM_VERSION', '1.0.0');
define('TIMEZONE', 'America/Sao_Paulo');  // Fuso horário

// Configurações de Email (opcional)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'seu_email@gmail.com');
define('SMTP_PASS', 'sua_senha_email');
define('SMTP_FROM', 'noreply@seudominio.com');
define('SMTP_FROM_NAME', 'IPTV Office');

// Configurações de Upload
define('UPLOAD_MAX_SIZE', 10485760);      // 10MB em bytes
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'svg']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Configurações de Paginação
define('ITEMS_PER_PAGE', 20);
define('MAX_ITEMS_PER_PAGE', 100);

// Configurações de Cache
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600);           // 1 hora em segundos

// Configurações de Log
define('LOG_ENABLED', true);
define('LOG_PATH', __DIR__ . '/../logs/');
define('LOG_LEVEL', 'error');             // debug, info, warning, error

// Configurações de API
define('API_RATE_LIMIT', 100);            // Requisições por minuto
define('API_TIMEOUT', 30);                // Timeout em segundos

// Modo de Desenvolvimento
define('DEBUG_MODE', false);              // SEMPRE false em produção!
define('SHOW_ERRORS', false);             // SEMPRE false em produção!

// Configurações de Sessão
define('SESSION_LIFETIME', 86400);        // 24 horas
define('SESSION_NAME', 'IPTV_SESSION');

// URLs do Sistema
define('BASE_URL', 'https://seudominio.com/');
define('API_URL', BASE_URL . 'api/');

// Configurações de Backup
define('BACKUP_ENABLED', true);
define('BACKUP_PATH', __DIR__ . '/../backups/');
define('BACKUP_RETENTION_DAYS', 30);

// Configurações de Notificações
define('NOTIFICATIONS_ENABLED', true);
define('TELEGRAM_BOT_TOKEN', '');
define('TELEGRAM_CHAT_ID', '');

// Configurações de Streaming
define('DEFAULT_STREAM_PROTOCOL', 'hls');
define('DEFAULT_BUFFER_SIZE', 8192);
define('MAX_CONNECTIONS_PER_USER', 3);

// Configurações de EPG
define('EPG_UPDATE_INTERVAL', 3600);      // 1 hora
define('EPG_RETENTION_DAYS', 7);

// Configurações de Servidor
define('SERVER_CHECK_INTERVAL', 300);     // 5 minutos
define('SERVER_TIMEOUT', 10);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

date_default_timezone_set(TIMEZONE);
?>
