-- Script de instalação do Painel IPTV Office
-- Execute este script após importar o car.sql

-- Criar grupo de administradores
INSERT INTO users_groups (group_id, group_name, is_admin, is_reseller, delete_users, can_delete, allowed_pages) 
VALUES (1, 'Administrador', 1, 0, 1, 1, '["*"]')
ON DUPLICATE KEY UPDATE group_name = 'Administrador';

-- Criar grupo de revendedores
INSERT INTO users_groups (group_id, group_name, is_admin, is_reseller, delete_users, can_delete, allowed_pages) 
VALUES (2, 'Revendedor', 0, 1, 1, 1, '["users", "lines", "streams", "activity"]')
ON DUPLICATE KEY UPDATE group_name = 'Revendedor';

-- Criar usuário administrador padrão
-- Usuário: admin
-- Senha: admin123 (ALTERE APÓS O PRIMEIRO LOGIN!)
INSERT INTO users (username, password, email, member_group_id, status, date_registered, credits) 
VALUES (
    'admin', 
    '$2y$10$YourHashedPasswordHere', 
    'admin@localhost.com', 
    1, 
    1, 
    UNIX_TIMESTAMP(), 
    999999.00
)
ON DUPLICATE KEY UPDATE username = 'admin';

-- IMPORTANTE: Gere o hash da senha usando PHP:
-- <?php echo password_hash('admin123', PASSWORD_BCRYPT); ?>
-- E substitua '$2y$10$YourHashedPasswordHere' pelo hash gerado

-- Criar configurações padrão do sistema
INSERT INTO settings (id) VALUES (1) ON DUPLICATE KEY UPDATE id = 1;

-- Criar tipos de streams padrão
INSERT INTO streams_types (type_name, type_key, type_output, live) VALUES
('Live TV', 'live', 'hls', 1),
('Filme', 'movie', 'mp4', 0),
('Série', 'series', 'mp4', 0),
('Rádio', 'radio', 'mp3', 1)
ON DUPLICATE KEY UPDATE type_name = VALUES(type_name);

-- Criar formatos de saída padrão
INSERT INTO output_formats (output_name, output_key, output_ext) VALUES
('HLS', 'hls', 'm3u8'),
('MPEG-TS', 'ts', 'ts'),
('MP4', 'mp4', 'mp4'),
('MKV', 'mkv', 'mkv')
ON DUPLICATE KEY UPDATE output_name = VALUES(output_name);

-- Criar categorias padrão
INSERT INTO streams_categories (category_type, category_name, cat_order) VALUES
('live', 'Canais Abertos', 1),
('live', 'Canais Fechados', 2),
('live', 'Esportes', 3),
('live', 'Filmes e Séries', 4),
('live', 'Documentários', 5),
('live', 'Infantil', 6),
('live', 'Notícias', 7),
('live', 'Música', 8),
('movie', 'Ação', 1),
('movie', 'Comédia', 2),
('movie', 'Drama', 3),
('movie', 'Terror', 4),
('movie', 'Ficção Científica', 5),
('movie', 'Romance', 6),
('series', 'Séries Nacionais', 1),
('series', 'Séries Internacionais', 2),
('series', 'Documentários', 3),
('series', 'Infantil', 4)
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- Otimizar tabelas
OPTIMIZE TABLE users;
OPTIMIZE TABLE `lines`;
OPTIMIZE TABLE streams;
OPTIMIZE TABLE servers;
OPTIMIZE TABLE lines_activity;
OPTIMIZE TABLE lines_live;

-- Criar índices adicionais para performance
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_lines_member ON `lines`(member_id);
CREATE INDEX idx_streams_type ON streams(type);
CREATE INDEX idx_activity_dates ON lines_activity(date_start, date_end);

-- Mensagem de sucesso
SELECT 'Instalação concluída com sucesso!' as message;
SELECT 'Usuário padrão: admin' as info;
SELECT 'Senha padrão: admin123 (ALTERE IMEDIATAMENTE!)' as warning;
SELECT 'Não esqueça de configurar o arquivo api/config.php' as reminder;
