-- Script de configuração rápida para testes locais
-- Execute este script no seu MySQL para criar o banco de teste

CREATE DATABASE IF NOT EXISTS iptv_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iptv_database;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    ip VARCHAR(255),
    date_registered INT,
    last_login INT,
    member_group_id INT,
    credits FLOAT DEFAULT 0,
    notes MEDIUMTEXT,
    status TINYINT(2) DEFAULT 1,
    reseller_dns MEDIUMTEXT,
    owner_id INT DEFAULT 0,
    override_packages TEXT,
    hue VARCHAR(50),
    theme INT(1) DEFAULT 0,
    timezone VARCHAR(255),
    api_key VARCHAR(64),
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de grupos
CREATE TABLE IF NOT EXISTS users_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name MEDIUMTEXT,
    is_admin TINYINT DEFAULT 0,
    is_reseller TINYINT DEFAULT 0,
    total_allowed_gen_trials INT DEFAULT 0,
    total_allowed_gen_in VARCHAR(255),
    delete_users TINYINT DEFAULT 0,
    allowed_pages MEDIUMTEXT,
    can_delete TINYINT DEFAULT 1,
    INDEX idx_is_admin (is_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de linhas
CREATE TABLE IF NOT EXISTS `lines` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    username VARCHAR(255),
    password VARCHAR(255),
    last_ip VARCHAR(255),
    exp_date INT,
    admin_enabled INT DEFAULT 1,
    enabled INT DEFAULT 1,
    admin_notes MEDIUMTEXT,
    reseller_notes MEDIUMTEXT,
    bouquet MEDIUMTEXT,
    allowed_outputs MEDIUMTEXT,
    max_connections INT DEFAULT 1,
    is_restreamer TINYINT DEFAULT 0,
    is_trial TINYINT DEFAULT 0,
    is_mag TINYINT DEFAULT 0,
    is_e2 TINYINT DEFAULT 0,
    created_at INT,
    INDEX idx_username (username),
    INDEX idx_member_id (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de streams
CREATE TABLE IF NOT EXISTS streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type INT,
    category_id LONGTEXT,
    stream_display_name MEDIUMTEXT,
    stream_source MEDIUMTEXT,
    stream_icon MEDIUMTEXT,
    notes MEDIUMTEXT,
    added INT,
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de servidores
CREATE TABLE IF NOT EXISTS servers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_name VARCHAR(255),
    server_ip VARCHAR(255),
    status TINYINT DEFAULT 1,
    enabled INT DEFAULT 1,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabelas auxiliares
CREATE TABLE IF NOT EXISTS lines_activity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    stream_id INT,
    server_id INT,
    date_start INT,
    date_end INT,
    INDEX idx_user_id (user_id),
    INDEX idx_stream_id (stream_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lines_live (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    stream_id INT,
    server_id INT,
    date_start INT,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servers_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id INT,
    cpu FLOAT DEFAULT 0,
    total_mem_used_percent FLOAT DEFAULT 0,
    connections INT DEFAULT 0,
    time INT,
    INDEX idx_server_id (server_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS streams_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_type VARCHAR(255),
    category_name VARCHAR(255),
    parent_id INT DEFAULT 0,
    cat_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir grupo administrador
INSERT INTO users_groups (group_id, group_name, is_admin, is_reseller, delete_users, can_delete, allowed_pages) 
VALUES (1, 'Administrador', 1, 0, 1, 1, '["*"]')
ON DUPLICATE KEY UPDATE group_name = 'Administrador';

-- Inserir usuário admin de teste
-- Senha: admin123
INSERT INTO users (username, password, email, member_group_id, status, date_registered, credits) 
VALUES (
    'admin', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin@localhost.com', 
    1, 
    1, 
    UNIX_TIMESTAMP(), 
    999999.00
)
ON DUPLICATE KEY UPDATE username = 'admin';

-- Inserir dados de exemplo
INSERT INTO `lines` (member_id, username, password, exp_date, admin_enabled, enabled, max_connections, created_at)
VALUES 
(1, 'teste1', 'senha123', UNIX_TIMESTAMP() + 2592000, 1, 1, 2, UNIX_TIMESTAMP()),
(1, 'teste2', 'senha456', UNIX_TIMESTAMP() + 2592000, 1, 1, 1, UNIX_TIMESTAMP());

INSERT INTO streams (type, stream_display_name, stream_source, added)
VALUES 
(1, 'Canal Teste 1', 'http://exemplo.com/stream1', UNIX_TIMESTAMP()),
(1, 'Canal Teste 2', 'http://exemplo.com/stream2', UNIX_TIMESTAMP());

INSERT INTO servers (server_name, server_ip, status, enabled)
VALUES 
('Servidor Principal', '192.168.1.100', 1, 1),
('Servidor Backup', '192.168.1.101', 1, 1);

SELECT 'Banco de dados configurado com sucesso!' as message;
SELECT 'Usuário: admin | Senha: admin123' as credentials;
