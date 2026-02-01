-- Script para criar usuário admin no banco existente
-- Execute este script APÓS importar o car.sql

USE iptv_database;

-- Inserir grupo administrador (se não existir)
INSERT INTO users_groups (group_id, group_name, is_admin, is_reseller, delete_users, can_delete, allowed_pages) 
VALUES (1, 'Administrador', 1, 0, 1, 1, '["*"]')
ON DUPLICATE KEY UPDATE group_name = 'Administrador';

-- Inserir usuário admin
-- Usuário: admin
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

SELECT 'Usuário admin criado com sucesso!' as message;
SELECT 'Login: admin | Senha: admin123' as credentials;
