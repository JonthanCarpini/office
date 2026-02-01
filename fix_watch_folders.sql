-- Script para corrigir a tabela watch_folders
-- Execute este script APÓS importar o car.sql (se der erro)
-- OU use este script para criar a tabela corretamente

USE iptv_database;

DROP TABLE IF EXISTS watch_folders;

CREATE TABLE watch_folders
(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    type                 VARCHAR(32)                NULL,
    directory            TEXT                       NULL,
    rclone_dir           TEXT                       NULL,
    server_id            INT(8)        DEFAULT 0    NULL,
    category_id          INT(8)        DEFAULT 0    NULL,
    bouquets             TEXT                       NULL,
    last_run             INT(32)       DEFAULT 0    NULL,
    active               INT(1)        DEFAULT 1    NULL,
    disable_tmdb         INT(1)        DEFAULT 0    NULL,
    ignore_no_match      INT(1)        DEFAULT 0    NULL,
    auto_subtitles       INT(1)        DEFAULT 0    NULL,
    fb_bouquets          TEXT                       NULL,
    fb_category_id       INT(8)        DEFAULT 0    NULL,
    allowed_extensions   TEXT                       NULL,
    language             VARCHAR(32)                NULL,
    read_native          TINYINT       DEFAULT 0    NULL,
    movie_symlink        TINYINT       DEFAULT 0    NULL,
    auto_encode          TINYINT       DEFAULT 1    NULL,
    ffprobe_input        TINYINT       DEFAULT 1    NULL,
    transcode_profile_id INT           DEFAULT 0    NULL,
    auto_upgrade         TINYINT       DEFAULT 0    NULL,
    fallback_title       TINYINT       DEFAULT 0    NULL,
    plex_ip              VARCHAR(128)               NULL,
    plex_port            INT(5)        DEFAULT 0    NULL,
    plex_username        VARCHAR(256)               NULL,
    plex_password        VARCHAR(256)               NULL,
    plex_libraries       MEDIUMTEXT                 NULL,
    scan_missing         TINYINT       DEFAULT 0    NULL,
    extract_metadata     TINYINT       DEFAULT 0    NULL,
    store_categories     TINYINT(1)    DEFAULT 0    NULL,
    duplicate_tmdb       TINYINT(1)    DEFAULT 0    NULL,
    check_tmdb           TINYINT(1)    DEFAULT 1    NULL,
    remove_subtitles     TINYINT(1)    DEFAULT 0    NULL,
    target_container     VARCHAR(64)                NULL,
    server_add           TEXT                       NULL,
    direct_proxy         TINYINT(1)    DEFAULT 0    NULL,
    plex_token           TEXT                       NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabela watch_folders corrigida com sucesso!' as message;
