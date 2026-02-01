-- we don't know how to generate root <with-no-name> (class Root) :(

create table access_codes
(
    id        int auto_increment
        primary key,
    code      varchar(255)      null,
    type      tinyint default 0 null,
    enabled   tinyint default 0 null,
    groups    mediumtext        null,
    whitelist mediumtext        null
)
    collate = utf8_unicode_ci;

create table blocked_asns
(
    id        int auto_increment
        primary key,
    asn       int(5)    default 0                     null,
    isp       varchar(256)                            null,
    domain    varchar(256)                            null,
    country   varchar(16)                             null,
    num_ips   int(16)   default 0                     null,
    type      varchar(64)                             null,
    allocated timestamp default '0000-00-00 00:00:00' null,
    blocked   tinyint   default 0                     null,
    constraint asn
        unique (asn)
)
    charset = utf8;

create table blocked_ips
(
    id    int auto_increment
        primary key,
    ip    varchar(39) null,
    notes mediumtext  null,
    date  int         null,
    constraint ip_2
        unique (ip),
    constraint ip_3
        unique (ip)
)
    collate = utf8_unicode_ci;

create index date
    on blocked_ips (date);

create index ip
    on blocked_ips (ip);

create table blocked_isps
(
    id      int auto_increment
        primary key,
    isp     mediumtext        null,
    blocked tinyint default 0 null
)
    charset = utf8;

create table blocked_uas
(
    id               int auto_increment
        primary key,
    user_agent       varchar(255)  null,
    exact_match      int default 0 null,
    attempts_blocked int default 0 null
)
    collate = utf8_unicode_ci;

create index exact_match
    on blocked_uas (exact_match);

create index user_agent
    on blocked_uas (user_agent);

create table bouquets
(
    id               int auto_increment
        primary key,
    bouquet_name     mediumtext        null,
    bouquet_channels mediumtext        null,
    bouquet_movies   mediumtext        null,
    bouquet_radios   mediumtext        null,
    bouquet_series   mediumtext        null,
    bouquet_order    int(16) default 0 null
)
    collate = utf8_unicode_ci;

create table crontab
(
    id       int auto_increment
        primary key,
    filename varchar(255)                     null,
    time     varchar(128) default '* * * * *' null,
    enabled  int          default 0           null
)
    collate = utf8_unicode_ci;

create index enabled
    on crontab (enabled);

create index filename
    on crontab (filename);

create table detect_restream
(
    id         int auto_increment
        primary key,
    ip         varchar(255) null,
    blocked    tinyint(1)   null,
    ports_open mediumtext   null,
    time       int          null
)
    collate = utf8_unicode_ci;

create table detect_restream_logs
(
    id        int auto_increment
        primary key,
    user_id   int          null,
    stream_id int          null,
    ip        varchar(255) null,
    time      int          null
)
    collate = utf8_unicode_ci;

create table enigma2_actions
(
    id        int auto_increment
        primary key,
    device_id int        null,
    type      mediumtext null,
    `key`     mediumtext null,
    command   mediumtext null,
    command2  mediumtext null
)
    charset = utf8;

create table enigma2_devices
(
    device_id        int(12) auto_increment
        primary key,
    mac              varchar(255) collate utf8_unicode_ci null,
    user_id          int                                  null,
    modem_mac        varchar(255)                         null,
    local_ip         varchar(255)                         null,
    public_ip        varchar(255)                         null,
    key_auth         varchar(255)                         null,
    enigma_version   varchar(255)                         null,
    cpu              varchar(255)                         null,
    version          varchar(255)                         null,
    lversion         mediumtext                           null,
    token            varchar(32)                          null,
    last_updated     int                                  null,
    watchdog_timeout int                                  null,
    lock_device      tinyint default 0                    null,
    telnet_enable    tinyint default 1                    null,
    ftp_enable       tinyint default 1                    null,
    ssh_enable       tinyint default 1                    null,
    dns              varchar(255)                         null,
    original_mac     varchar(255)                         null,
    rc               tinyint default 1                    null,
    mac_filter       varchar(50)                          null
)
    charset = utf8;

create index mac
    on enigma2_devices (mac);

create fulltext index search
    on enigma2_devices (mac_filter, public_ip);

create index user_id
    on enigma2_devices (user_id);

create table epg
(
    id           int auto_increment
        primary key,
    epg_name     varchar(255)  null,
    epg_file     varchar(300)  null,
    last_updated int           null,
    days_keep    int default 7 null,
    data         longtext      null,
    `offset`     int default 0 null
)
    collate = utf8_unicode_ci;

create table epg_api
(
    stationId         int(8)                           not null,
    altId             varchar(50)                      null,
    callSign          varchar(256)                     null,
    name              varchar(256)                     null,
    bcastLangs        longtext collate utf8mb4_bin     null,
    type              varchar(128)                     null,
    signalType        varchar(128) collate utf8mb4_bin null,
    videoType         varchar(128)                     null,
    affiliateId       int                              null,
    affiliateCallSign varchar(128)                     null,
    picon             varchar(1024)                    null,
    eng               int(1) default 0                 not null
)
    charset = utf8mb4;

create table epg_channels
(
    id         int(8),
    epg_id     int(8)                         null,
    channel_id varchar(64)                    null,
    name       varchar(256)                   null,
    langs      mediumtext collate utf8mb4_bin null
)
    charset = utf8mb4;

create index id
    on epg_channels (id);

alter table epg_channels
    modify id int(8) auto_increment;

create table epg_data
(
    id          int auto_increment
        primary key,
    epg_id      int                                  null,
    title       varchar(255) collate utf8_unicode_ci null,
    lang        varchar(10) collate utf8_unicode_ci  null,
    start       int                                  null,
    end         int                                  null,
    description mediumtext collate utf8_unicode_ci   null,
    channel_id  varchar(50) collate utf8_unicode_ci  null
)
    charset = utf8mb4;

create index channel_id
    on epg_data (channel_id);

create index end
    on epg_data (end);

create index epg_id
    on epg_data (epg_id);

create index lang
    on epg_data (lang);

create index start
    on epg_data (start);

create table epg_languages
(
    id        int(8),
    language  varchar(256)                          null,
    name      varchar(256)                          null,
    dateadded timestamp default current_timestamp() null
)
    charset = utf8mb4;

create index id
    on epg_languages (id);

alter table epg_languages
    modify id int(8) auto_increment;

create table hmac_keys
(
    id      int auto_increment
        primary key,
    `key`   varchar(64)       null,
    notes   varchar(1024)     null,
    enabled tinyint default 1 null
)
    collate = utf8_unicode_ci;

create table `lines`
(
    id                    int auto_increment
        primary key,
    member_id             int                                   null,
    username              varchar(255)                          null,
    password              varchar(255)                          null,
    last_ip               varchar(255)                          null,
    exp_date              int                                   null,
    admin_enabled         int       default 1                   null,
    enabled               int       default 1                   null,
    admin_notes           mediumtext                            null,
    reseller_notes        mediumtext                            null,
    bouquet               mediumtext                            null,
    allowed_outputs       mediumtext                            null,
    max_connections       int       default 1                   null,
    is_restreamer         tinyint   default 0                   null,
    is_trial              tinyint   default 0                   null,
    is_mag                tinyint   default 0                   null,
    is_e2                 tinyint   default 0                   null,
    is_stalker            tinyint   default 0                   null,
    is_isplock            tinyint   default 0                   null,
    allowed_ips           mediumtext                            null,
    allowed_ua            mediumtext                            null,
    created_at            int                                   null,
    pair_id               int                                   null,
    force_server_id       int       default 0                   null,
    as_number             varchar(30)                           null,
    isp_desc              mediumtext                            null,
    forced_country        varchar(3)                            null,
    bypass_ua             tinyint   default 0                   null,
    play_token            mediumtext                            null,
    last_expiration_video int                                   null,
    package_id            int                                   null,
    access_token          varchar(32)                           null,
    contact               mediumtext                            null,
    last_activity         int                                   null,
    last_activity_array   mediumtext                            null,
    updated               timestamp default current_timestamp() null on update current_timestamp()
)
    collate = utf8_unicode_ci;

create index admin_enabled
    on `lines` (admin_enabled);

create index created_at
    on `lines` (created_at);

create index enabled
    on `lines` (enabled);

create index exp_date
    on `lines` (exp_date);

create index is_e2
    on `lines` (is_e2);

create index is_mag
    on `lines` (is_mag);

create index is_restreamer
    on `lines` (is_restreamer);

create index is_trial
    on `lines` (is_trial);

create index member_id
    on `lines` (member_id);

create index order_default
    on `lines` (id, is_mag, is_e2);

create index pair_id
    on `lines` (pair_id);

create index password
    on `lines` (password);

create fulltext index search
    on `lines` (username, admin_notes, reseller_notes, last_ip, contact);

create index username
    on `lines` (username);

create table lines_activity
(
    activity_id        int auto_increment
        primary key,
    user_id            int             null,
    stream_id          int             null,
    server_id          int             null,
    proxy_id           int             null,
    user_agent         varchar(255)    null,
    user_ip            varchar(39)     null,
    container          varchar(50)     null,
    date_start         int             null,
    date_end           int             null,
    geoip_country_code varchar(22)     null,
    isp                varchar(255)    null,
    external_device    varchar(255)    null,
    divergence         float default 0 null,
    hmac_id            tinyint         null,
    hmac_identifier    varchar(255)    null
)
    collate = utf8_unicode_ci;

create index container
    on lines_activity (container);

create index date_end
    on lines_activity (date_end);

create index date_start
    on lines_activity (date_start);

create index date_start_2
    on lines_activity (date_start, date_end);

create index geoip_country_code
    on lines_activity (geoip_country_code);

create index isp
    on lines_activity (isp);

create index parent_id
    on lines_activity (proxy_id);

create index server_id
    on lines_activity (server_id);

create index stream_id
    on lines_activity (stream_id);

create index user_agent
    on lines_activity (user_agent);

create index user_id
    on lines_activity (user_id);

create index user_ip
    on lines_activity (user_ip);

create table lines_divergence
(
    id         int auto_increment
        primary key,
    uuid       varchar(32) null,
    divergence float       null,
    constraint uuid
        unique (uuid)
);

create table lines_live
(
    activity_id        int auto_increment
        primary key,
    user_id            int               null,
    stream_id          int               null,
    server_id          int               null,
    proxy_id           int               null,
    user_agent         varchar(255)      null,
    user_ip            varchar(39)       null,
    container          varchar(50)       null,
    pid                int               null,
    active_pid         int               null,
    date_start         int               null,
    date_end           int               null,
    geoip_country_code varchar(22)       null,
    isp                varchar(255)      null,
    external_device    varchar(255)      null,
    divergence         float   default 0 null,
    hls_last_read      int               null,
    hls_end            tinyint default 0 null,
    fingerprinting     tinyint default 0 null,
    hmac_id            tinyint           null,
    hmac_identifier    varchar(255)      null,
    init               tinyint default 1 null,
    uuid               varchar(32)       null
)
    collate = utf8_unicode_ci;

create index active_pid
    on lines_live (active_pid);

create index container
    on lines_live (container);

create index date_end
    on lines_live (date_end);

create index date_start
    on lines_live (date_start);

create index fingerprinting
    on lines_live (fingerprinting);

create index geoip_country_code
    on lines_live (geoip_country_code);

create index hls_end
    on lines_live (hls_end);

create index hmac_id
    on lines_live (hmac_id);

create index hmac_identifier
    on lines_live (hmac_identifier);

create index parent_id
    on lines_live (proxy_id);

create index pid
    on lines_live (pid);

create index server_id
    on lines_live (server_id);

create index stream_id
    on lines_live (stream_id);

create index user_agent
    on lines_live (user_agent);

create index user_id
    on lines_live (user_id);

create index user_ip
    on lines_live (user_ip);

create index uuid
    on lines_live (uuid);

create table lines_logs
(
    id            int auto_increment
        primary key,
    stream_id     int          null,
    user_id       int          null,
    client_status varchar(255) null,
    query_string  mediumtext   null,
    user_agent    varchar(255) null,
    ip            varchar(255) null,
    extra_data    mediumtext   null,
    date          int          null
)
    collate = utf8_unicode_ci;

create index stream_id
    on lines_logs (stream_id);

create index user_id
    on lines_logs (user_id);

create table login_logs
(
    id          int auto_increment
        primary key,
    type        varchar(50)  null,
    access_code int          null,
    user_id     int          null,
    status      varchar(50)  null,
    login_ip    varchar(255) null,
    date        int          null
)
    collate = utf8_unicode_ci;

create index user_id
    on login_logs (user_id);

create table mag_claims
(
    id        int auto_increment
        primary key,
    mag_id    int         null,
    stream_id int         null,
    real_type varchar(10) null,
    date      datetime    null
)
    charset = utf8;

create index date
    on mag_claims (date);

create index mag_id
    on mag_claims (mag_id);

create index real_type
    on mag_claims (real_type);

create index stream_id
    on mag_claims (stream_id);

create table mag_devices
(
    mag_id                     int auto_increment
        primary key,
    user_id                    int                               null,
    bright                     int(10)      default 200          null,
    contrast                   int(10)      default 127          null,
    saturation                 int(10)      default 127          null,
    aspect                     mediumtext                        null,
    video_out                  varchar(20)  default 'rca'        null,
    volume                     int(5)       default 50           null,
    playback_buffer_bytes      int(50)      default 0            null,
    playback_buffer_size       int(50)      default 0            null,
    audio_out                  int(5)       default 1            null,
    mac                        varchar(50)                       null,
    ip                         varchar(20)                       null,
    ls                         varchar(20)                       null,
    ver                        varchar(300)                      null,
    lang                       varchar(50)                       null,
    locale                     varchar(30)  default 'en_GB.utf8' null,
    city_id                    int          default 0            null,
    hd                         int(10)      default 1            null,
    main_notify                int(5)       default 1            null,
    fav_itv_on                 int(5)       default 0            null,
    now_playing_start          int(50)                           null,
    now_playing_type           int          default 0            null,
    now_playing_content        varchar(50)                       null,
    time_last_play_tv          int(50)                           null,
    time_last_play_video       int(50)                           null,
    hd_content                 int          default 1            null,
    image_version              varchar(350)                      null,
    last_change_status         int                               null,
    last_start                 int                               null,
    last_active                int                               null,
    keep_alive                 int                               null,
    playback_limit             int          default 3            null,
    screensaver_delay          int          default 10           null,
    stb_type                   varchar(20)                       null,
    sn                         varchar(255)                      null,
    last_watchdog              int(50)                           null,
    created                    int                               null,
    country                    varchar(5)                        null,
    plasma_saving              int          default 0            null,
    ts_enabled                 int          default 0            null,
    ts_enable_icon             int          default 1            null,
    ts_path                    varchar(35)                       null,
    ts_max_length              int          default 3600         null,
    ts_buffer_use              varchar(15)  default 'cyclic'     null,
    ts_action_on_exit          varchar(20)  default 'no_save'    null,
    ts_delay                   varchar(20)  default 'on_pause'   null,
    video_clock                varchar(10)  default 'Off'        null,
    rtsp_type                  int          default 4            null,
    rtsp_flags                 int          default 0            null,
    stb_lang                   varchar(15)  default 'en'         null,
    display_menu_after_loading int          default 1            null,
    record_max_length          int          default 180          null,
    plasma_saving_timeout      int          default 600          null,
    now_playing_link_id        int                               null,
    now_playing_streamer_id    int                               null,
    device_id                  varchar(255)                      null,
    device_id2                 varchar(255)                      null,
    hw_version                 varchar(255)                      null,
    parent_password            varchar(20)  default '0000'       null,
    spdif_mode                 int          default 1            null,
    show_after_loading         varchar(60)  default 'main_menu'  null,
    play_in_preview_by_ok      int          default 1            null,
    hdmi_event_reaction        int          default 1            null,
    mag_player                 varchar(20)  default 'ffmpeg'     null,
    play_in_preview_only_by_ok varchar(10)  default 'true'       null,
    watchdog_timeout           int                               null,
    fav_channels               mediumtext                        null,
    tv_archive_continued       mediumtext                        null,
    tv_channel_default_aspect  varchar(255) default 'fit'        null,
    last_itv_id                int          default 0            null,
    units                      varchar(20)  default 'metric'     null,
    token                      varchar(32)                       null,
    lock_device                tinyint      default 0            null,
    theme_type                 tinyint(1)   default 0            null,
    mac_filter                 varchar(50)                       null
)
    collate = utf8_unicode_ci;

create index mac
    on mag_devices (mac);

create fulltext index search
    on mag_devices (mac_filter, ip);

create index user_id
    on mag_devices (user_id);

create table mag_events
(
    id                     int auto_increment
        primary key,
    status                 tinyint(3) default 0 null,
    mag_device_id          int                  null,
    event                  varchar(20)          null,
    need_confirm           tinyint(3) default 0 null,
    msg                    mediumtext           null,
    reboot_after_ok        tinyint(3) default 0 null,
    auto_hide_timeout      tinyint(3) default 0 null,
    send_time              int(50)              null,
    additional_services_on tinyint(3) default 1 null,
    anec                   tinyint(3) default 0 null,
    vclub                  tinyint(3) default 0 null
)
    collate = utf8_unicode_ci;

create index event
    on mag_events (event);

create index mag_device_id
    on mag_events (mag_device_id);

create index status
    on mag_events (status);

create table mag_logs
(
    id     int auto_increment
        primary key,
    mag_id int          null,
    action varchar(255) null
)
    collate = utf8_unicode_ci;

create index mag_id
    on mag_logs (mag_id);

create table mysql_syslog
(
    id         int auto_increment
        primary key,
    type       varchar(50)       null,
    error      longtext          null,
    username   varchar(64)       null,
    ip         varchar(64)       null,
    `database` varchar(64)       null,
    date       int               null,
    server_id  tinyint default 1 null
)
    collate = utf8_unicode_ci;

create table ondemand_check
(
    id          int auto_increment
        primary key,
    stream_id   int           null,
    server_id   int           null,
    status      int(1)        null,
    source_id   int(4)        null,
    source_url  varchar(1024) null,
    video_codec varchar(50)   null,
    audio_codec varchar(50)   null,
    resolution  varchar(50)   null,
    response    int           null,
    fps         int           null,
    errors      mediumtext    null,
    date        int           null
);

create table output_devices
(
    device_id       int auto_increment
        primary key,
    device_name     varchar(255)  null,
    device_key      varchar(255)  null,
    device_filename varchar(255)  null,
    device_header   mediumtext    null,
    device_conf     mediumtext    null,
    device_footer   mediumtext    null,
    default_output  int default 0 null,
    copy_text       mediumtext    null
)
    collate = utf8_unicode_ci;

create index default_output
    on output_devices (default_output);

create index device_key
    on output_devices (device_key);

create table output_formats
(
    access_output_id int auto_increment
        primary key,
    output_name      varchar(255) null,
    output_key       varchar(255) null,
    output_ext       varchar(255) null
)
    collate = utf8_unicode_ci;

create index output_ext
    on output_formats (output_ext);

create index output_key
    on output_formats (output_key);

create table panel_logs
(
    id          int auto_increment
        primary key,
    type        varchar(50) default 'pdo' not null,
    log_message longtext                  null,
    log_extra   longtext                  null,
    line        int                       null,
    date        int                       null,
    server_id   int                       null,
    `unique`    varchar(32)               null
)
    collate = utf8_unicode_ci;

create table panel_stats
(
    id        int auto_increment
        primary key,
    type      varchar(16)       null,
    time      int(16) default 0 null,
    count     float   default 0 null,
    server_id int(16) default 0 null
);

create table profiles
(
    profile_id      int auto_increment
        primary key,
    profile_name    varchar(255) null,
    profile_options mediumtext   null
)
    collate = utf8_unicode_ci;

create table providers
(
    id           int auto_increment
        primary key,
    name         varchar(128)          null,
    ip           varchar(128)          null,
    port         int(5)     default 80 null,
    username     varchar(128)          null,
    password     varchar(128)          null,
    data         mediumtext            null,
    last_changed int                   null,
    legacy       tinyint(1) default 0  null,
    enabled      tinyint(1) default 1  null,
    status       tinyint(1) default 0  null,
    `ssl`        tinyint(1) default 0  null,
    hls          tinyint(1) default 0  null
);

create table providers_streams
(
    id                  int auto_increment
        primary key,
    provider_id         int                            null,
    stream_id           int                            null,
    category_id         mediumtext collate utf8mb4_bin null,
    category_array      mediumtext                     null,
    stream_display_name mediumtext                     null,
    stream_icon         mediumtext                     null,
    channel_id          varchar(255)                   null,
    added               int                            null,
    modified            int                            null,
    type                varchar(16) default 'live'     null
)
    collate = utf8_unicode_ci;

create index channel_id
    on providers_streams (channel_id);

create table queue
(
    id        int auto_increment
        primary key,
    type      varchar(32) null,
    server_id int         null,
    stream_id int         null,
    pid       int         null,
    added     int         null
)
    charset = utf8;

create table recordings
(
    id          int auto_increment
        primary key,
    stream_id   int                  null,
    created_id  int                  null,
    category_id longtext             null,
    bouquets    longtext             null,
    title       mediumtext           null,
    description mediumtext           null,
    stream_icon mediumtext           null,
    start       int                  null,
    end         int                  null,
    source_id   int                  null,
    archive     int                  null,
    status      tinyint(1) default 0 null
);

create table rtmp_ips
(
    id       int auto_increment
        primary key,
    ip       varchar(255) null,
    password varchar(128) null,
    notes    mediumtext   null,
    push     tinyint(1)   null,
    pull     tinyint(1)   null,
    constraint ip
        unique (ip)
)
    charset = utf8;

create table servers
(
    id                       int auto_increment
        primary key,
    server_type              int(1)       default 0              null,
    xui_version              varchar(50)                         null,
    server_name              varchar(255)                        null,
    domain_name              mediumtext                          null,
    server_ip                varchar(255)                        null,
    private_ip               varchar(255)                        null,
    is_main                  int(16)      default 0              null,
    enabled                  int(16)      default 1              null,
    parent_id                text                                null,
    http_broadcast_port      int          default 80             null,
    https_broadcast_port     int          default 443            null,
    http_ports_add           mediumtext                          null,
    https_ports_add          mediumtext                          null,
    total_clients            int          default 250            null,
    network_interface        varchar(255) default 'eth0'         null,
    status                   tinyint      default -1             null,
    enable_geoip             int          default 0              null,
    geoip_countries          mediumtext                          null,
    last_check_ago           int          default 0              null,
    server_hardware          mediumtext                          null,
    total_services           int          default 3              null,
    persistent_connections   tinyint      default 0              null,
    rtmp_port                int          default 8880           null,
    geoip_type               varchar(13)  default 'low_priority' null,
    isp_names                mediumtext                          null,
    isp_type                 varchar(13)  default 'low_priority' null,
    enable_isp               tinyint      default 0              null,
    network_guaranteed_speed int          default 1000           null,
    timeshift_only           tinyint      default 0              null,
    whitelist_ips            mediumtext                          null,
    watchdog_data            mediumtext                          null,
    video_devices            mediumtext                          null,
    audio_devices            mediumtext                          null,
    gpu_info                 mediumtext                          null,
    interfaces               mediumtext                          null,
    random_ip                tinyint      default 0              null,
    enable_proxy             tinyint      default 0              null,
    enable_https             tinyint      default 0              null,
    certbot_renew            tinyint      default 0              null,
    certbot_ssl              mediumtext                          null,
    uuid                     varchar(256)                        null,
    use_disk                 tinyint(1)   default 0              null,
    last_status              tinyint      default 1              null,
    time_offset              int          default 0              null,
    ping                     int          default 0              null,
    requests_per_second      int          default 0              null,
    xui_revision             int(2)                              null,
    php_version              int(2)       default 74             null,
    php_pids                 longtext                            null,
    connections              int(16)      default 0              null,
    users                    int(16)      default 0              null,
    remote_status            tinyint(1)   default 1              null,
    governors                mediumtext                          null,
    governor                 varchar(512)                        null,
    sysctl                   mediumtext                          null,
    `order`                  int                                 null,
    enable_gzip              tinyint(1)   default 0              null,
    limit_requests           int          default 0              null,
    limit_burst              int          default 0              null
)
    collate = utf8_unicode_ci;

create index status
    on servers (status);

create index total_clients
    on servers (total_clients);

create table servers_stats
(
    id                     int auto_increment
        primary key,
    server_id              int         default 0 null,
    connections            int         default 0 null,
    streams                int         default 0 null,
    users                  int         default 0 null,
    cpu                    float       default 0 null,
    cpu_cores              int         default 0 null,
    cpu_avg                float       default 0 null,
    total_mem              int         default 0 null,
    total_mem_free         int         default 0 null,
    total_mem_used         int         default 0 null,
    total_mem_used_percent float       default 0 null,
    total_disk_space       bigint      default 0 null,
    uptime                 varchar(255)          null,
    total_running_streams  int         default 0 null,
    bytes_sent             bigint      default 0 null,
    bytes_received         bigint      default 0 null,
    bytes_sent_total       bigint(128) default 0 null,
    bytes_received_total   bigint(128) default 0 null,
    cpu_load_average       float       default 0 null,
    gpu_info               mediumtext            null,
    iostat_info            mediumtext            null,
    time                   int(16)     default 0 null,
    total_users            int         default 0 null
)
    collate = utf8_unicode_ci;

create table settings
(
    id                                    int                                                        not null,
    server_name                           mediumtext                                                 null,
    default_timezone                      varchar(255)  default 'Europe/London'                      null,
    allowed_stb_types                     mediumtext                                                 null,
    client_prebuffer                      int           default 30                                   null,
    split_clients                         varchar(255)  default 'equal'                              null,
    stream_max_analyze                    int           default 5000000                              null,
    show_not_on_air_video                 tinyint       default 1                                    null,
    not_on_air_video_path                 mediumtext                                                 null,
    show_banned_video                     tinyint       default 1                                    null,
    banned_video_path                     mediumtext                                                 null,
    show_expired_video                    tinyint       default 1                                    null,
    expired_video_path                    mediumtext                                                 null,
    show_expiring_video                   tinyint       default 1                                    null,
    expiring_video_path                   mediumtext                                                 null,
    mag_container                         varchar(255)  default 'ts'                                 null,
    api_container                         varchar(255)  default 'ts'                                 null,
    probesize                             int           default 5000000                              null,
    allowed_ips_admin                     mediumtext                                                 null,
    block_svp                             tinyint       default 1                                    null,
    allow_countries                       mediumtext                                                 null,
    user_auto_kick_hours                  int           default 4                                    null,
    disallow_empty_user_agents            tinyint       default 1                                    null,
    show_all_category_mag                 tinyint       default 1                                    null,
    flood_limit                           int           default 40                                   null,
    flood_ips_exclude                     mediumtext                                                 null,
    flood_seconds                         int           default 2                                    null,
    vod_bitrate_plus                      int           default 60                                   null,
    read_buffer_size                      int           default 8192                                 null,
    seg_time                              int(3)        default 6                                    null,
    seg_list_size                         int(3)        default 6                                    null,
    tv_channel_default_aspect             varchar(255)  default 'fit'                                null,
    playback_limit                        int           default 4                                    null,
    show_tv_channel_logo                  tinyint       default 1                                    null,
    show_channel_logo_in_preview          tinyint       default 1                                    null,
    enable_connection_problem_indication  tinyint       default 1                                    null,
    vod_limit_perc                        int           default 150                                  null,
    allowed_stb_types_for_local_recording mediumtext                                                 null,
    stalker_theme                         varchar(255)  default 'digital'                            null,
    rtmp_random                           tinyint       default 1                                    null,
    api_ips                               mediumtext                                                 null,
    use_buffer                            tinyint       default 0                                    null,
    restreamer_prebuffer                  tinyint       default 0                                    null,
    audio_restart_loss                    tinyint       default 0                                    null,
    stalker_lock_images                   mediumtext                                                 null,
    channel_number_type                   varchar(25)   default 'bouquet'                            null,
    stb_change_pass                       tinyint       default 0                                    null,
    enable_debug_stalker                  tinyint       default 0                                    null,
    online_capacity_interval              smallint      default 10                                   null,
    always_enabled_subtitles              tinyint       default 1                                    null,
    test_download_url                     varchar(255)  default 'https://speed.hetzner.de/100MB.bin' null,
    api_pass                              varchar(255)                                               null,
    message_of_day                        mediumtext                                                 null,
    enable_isp_lock                       tinyint       default 1                                    null,
    show_isps                             tinyint       default 1                                    null,
    save_closed_connection                tinyint       default 1                                    null,
    client_logs_save                      tinyint       default 1                                    null,
    case_sensitive_line                   tinyint       default 1                                    null,
    county_override_1st                   tinyint       default 0                                    null,
    disallow_2nd_ip_con                   tinyint       default 0                                    null,
    split_by                              varchar(255)  default 'con'                                null,
    use_mdomain_in_lists                  tinyint       default 1                                    null,
    priority_backup                       tinyint       default 1                                    null,
    tmdb_api_key                          mediumtext                                                 null,
    mag_security                          tinyint       default 1                                    null,
    hls_accelerator                       tinyint(1)    default 1                                    null,
    backups_pid                           int(5)        default 0                                    null,
    backups_to_keep                       int(5)        default 0                                    null,
    cc_time                               int(10)       default 0                                    null,
    dashboard_stats                       tinyint(1)    default 1                                    null,
    default_entries                       int(5)        default 50                                   null,
    disable_trial                         tinyint(1)    default 0                                    null,
    download_images                       tinyint(1)    default 1                                    null,
    dropbox_keep                          tinyint(1)    default 0                                    null,
    dropbox_remote                        tinyint(1)    default 0                                    null,
    ip_logout                             tinyint(1)    default 1                                    null,
    last_backup                           int(10)       default 0                                    null,
    login_flood                           tinyint(1)    default 15                                   null,
    recaptcha_enable                      tinyint(1)    default 0                                    null,
    reseller_restrictions                 tinyint(1)    default 0                                    null,
    stats_pid                             int(5)        default 0                                    null,
    tmdb_pid                              int(5)        default 0                                    null,
    watch_pid                             int(5)        default 0                                    null,
    automatic_backups                     varchar(16)   default 'off'                                null,
    dropbox_token                         varchar(256)  default ''                                   null,
    recaptcha_v2_secret_key               varchar(256)  default ''                                   null,
    recaptcha_v2_site_key                 varchar(256)  default ''                                   null,
    tmdb_language                         varchar(16)   default ''                                   null,
    release_parser                        varchar(16)   default 'python'                             null,
    language                              varchar(16)   default 'en'                                 null,
    encrypt_hls                           tinyint(1)    default 0                                    null,
    disable_ts                            tinyint(1)    default 0                                    null,
    disable_ts_allow_restream             tinyint(1)    default 0                                    null,
    disable_hls                           tinyint(1)    default 0                                    null,
    disable_hls_allow_restream            tinyint(1)    default 0                                    null,
    disable_rtmp                          tinyint(1)    default 1                                    null,
    disable_rtmp_allow_restream           tinyint(1)    default 0                                    null,
    date_format                           varchar(16)   default 'Y-m-d'                              null,
    datetime_format                       varchar(16)   default 'Y-m-d H:i:s'                        null,
    enable_epg_api                        tinyint(1)    default 1                                    null,
    epg_api_days_fetch                    tinyint       default 7                                    null,
    epg_api_days_keep                     tinyint       default 7                                    null,
    epg_api_extended                      tinyint       default 0                                    null,
    streams_grouped                       tinyint(1)    default 1                                    null,
    disable_player_api                    tinyint(1)    default 0                                    null,
    disable_playlist                      tinyint(1)    default 0                                    null,
    disable_xmltv                         tinyint(1)    default 0                                    null,
    disable_enigma2                       tinyint(1)    default 1                                    null,
    disable_ministra                      tinyint(1)    default 0                                    null,
    api_redirect                          tinyint(1)    default 0                                    null,
    movie_year_append                     tinyint(1)    default 0                                    null,
    log_clear                             int           default 31                                   null,
    cleanup                               tinyint(1)    default 1                                    null,
    fingerprint_max                       int           default 25                                   null,
    bruteforce_mac_attempts               tinyint       default 5                                    null,
    bruteforce_username_attempts          tinyint       default 10                                   null,
    bruteforce_frequency                  int           default 300                                  null,
    auto_update_lbs                       tinyint       default 1                                    null,
    update_version                        varchar(50)                                                null,
    dashboard_display_alt                 tinyint       default 1                                    null,
    dashboard_map                         tinyint       default 1                                    null,
    cpu_limit                             tinyint       default 0                                    null,
    mem_limit                             int           default 0                                    null,
    detect_restream_servers               tinyint(1)    default 1                                    null,
    detect_restream_block_user            tinyint(1)    default 0                                    null,
    detect_restream_block_ip              tinyint(1)    default 0                                    null,
    detect_restream_ports                 varchar(1024) default '[25461,25550,31210]'                null,
    cloudflare                            tinyint(1)    default 0                                    null,
    js_navigate                           tinyint(1)    default 1                                    null,
    encrypt_playlist                      tinyint(1)    default 1                                    null,
    encrypt_playlist_restreamer           tinyint(1)    default 1                                    null,
    stream_logs_save                      tinyint(1)    default 1                                    null,
    restrict_same_ip                      tinyint(1)    default 1                                    null,
    show_tickets                          tinyint(1)    default 1                                    null,
    percentage_match                      tinyint(1)    default 80                                   null,
    thread_count                          int           default 4                                    null,
    scan_seconds                          int           default 86400                                null,
    verify_host                           tinyint       default 1                                    null,
    max_genres                            tinyint       default 3                                    null,
    legacy_get                            tinyint       default 0                                    null,
    legacy_xmltv                          tinyint       default 0                                    null,
    mag_disable_ssl                       tinyint       default 0                                    null,
    hide_failures                         tinyint       default 0                                    null,
    legacy_panel_api                      tinyint       default 0                                    null,
    connection_loop_per                   tinyint       default 0                                    null,
    connection_loop_count                 tinyint       default 0                                    null,
    api_probe                             tinyint       default 1                                    null,
    max_simultaneous_downloads            tinyint       default 2                                    null,
    restart_php_fpm                       tinyint       default 1                                    null,
    cache_playlists                       int           default 0                                    null,
    send_xui_header                       int           default 1                                    null,
    request_prebuffer                     int           default 1                                    null,
    debug_show_errors                     tinyint       default 0                                    null,
    block_streaming_servers               tinyint       default 0                                    null,
    block_proxies                         tinyint       default 0                                    null,
    ip_subnet_match                       tinyint       default 0                                    null,
    last_cache                            int           default 0                                    null,
    last_cache_taken                      int           default 0                                    null,
    ministra_allow_blank                  int           default 0                                    null,
    enable_cache                          tinyint       default 1                                    null,
    legacy_mag_auth                       tinyint       default 0                                    null,
    ignore_invalid_users                  tinyint       default 0                                    null,
    on_demand_instant_off                 tinyint       default 0                                    null,
    on_demand_failure_exit                tinyint       default 0                                    null,
    on_demand_wait_time                   tinyint       default 20                                   null,
    playlist_from_mysql                   tinyint       default 0                                    null,
    show_images                           tinyint       default 1                                    null,
    kill_rogue_ffmpeg                     tinyint       default 1                                    null,
    monitor_connection_status             tinyint       default 1                                    null,
    stream_fail_sleep                     tinyint       default 10                                   null,
    custom_ip_header                      varchar(256)  default ''                                   null,
    send_protection_headers               tinyint       default 0                                    null,
    send_altsvc_header                    tinyint       default 0                                    null,
    send_server_header                    varchar(256)  default ''                                   null,
    send_unique_header                    varchar(256)  default ''                                   null,
    send_unique_header_domain             varchar(256)  default ''                                   null,
    max_items                             int           default 0                                    null,
    restrict_playlists                    tinyint       default 1                                    null,
    mag_legacy_redirect                   tinyint       default 0                                    null,
    save_login_logs                       tinyint       default 1                                    null,
    save_restart_logs                     tinyint       default 1                                    null,
    keep_activity                         int           default 0                                    null,
    keep_client                           int           default 0                                    null,
    keep_login                            int           default 0                                    null,
    keep_errors                           int           default 0                                    null,
    keep_restarts                         int           default 0                                    null,
    ignore_keyframes                      int           default 0                                    null,
    seg_delete_threshold                  int           default 4                                    null,
    fails_per_time                        int           default 86400                                null,
    segment_type                          tinyint(1)    default 1                                    null,
    thread_count_movie                    tinyint(3)    default 5                                    null,
    thread_count_show                     tinyint(3)    default 1                                    null,
    redirect_timeout                      tinyint(1)    default 5                                    null,
    create_expiration                     tinyint(3)    default 5                                    null,
    redis_handler                         tinyint(1)    default 0                                    null,
    redis_password                        varchar(512)  default ''                                   null,
    force_epg_timezone                    tinyint(1)    default 0                                    null,
    check_vod                             tinyint(1)    default 0                                    null,
    max_encode_movies                     int           default 10                                   null,
    max_encode_cc                         int           default 1                                    null,
    queue_loop                            int           default 1                                    null,
    cache_thread_count                    int(4)        default 4                                    null,
    cache_changes                         tinyint(1)    default 1                                    null,
    player_blur                           tinyint(1)    default 0                                    null,
    player_opacity                        tinyint(1)    default 10                                   null,
    player_allow_playlist                 tinyint(1)    default 1                                    null,
    player_allow_bouquet                  tinyint(1)    default 1                                    null,
    player_hide_incompatible              tinyint(1)    default 0                                    null,
    player_allow_hevc                     tinyint(1)    default 0                                    null,
    read_native_hls                       tinyint(1)    default 1                                    null,
    keep_protocol                         tinyint(1)    default 0                                    null,
    ffmpeg_cpu                            varchar(8)    default '4.0'                                null,
    ffmpeg_gpu                            varchar(8)    default '4.0'                                null,
    header_stats                          tinyint(1)    default 1                                    null,
    mag_keep_extension                    tinyint(1)    default 1                                    null,
    show_connected_video                  tinyint(1)    default 1                                    null,
    connected_video_path                  mediumtext                                                 null,
    disallow_2nd_ip_max                   int           default 1                                    null,
    probesize_ondemand                    int           default 256000                               null,
    ffmpeg_warnings                       int           default 1                                    null,
    vod_sort_newest                       tinyint(1)    default 0                                    null,
    mag_message                           mediumtext                                                 null,
    mag_default_type                      tinyint(1)    default 0                                    null,
    fps_delay                             int           default 600                                  null,
    fps_check_type                        tinyint(1)    default 1                                    null,
    show_category_duplicates              tinyint(1)    default 0                                    null,
    probe_extra_wait                      int           default 10                                   null,
    restream_deny_unauthorised            tinyint(1)    default 1                                    null,
    extract_subtitles                     tinyint(1)    default 0                                    null,
    reseller_ssl_domain                   tinyint(1)    default 1                                    null,
    auto_send_logs                        tinyint(1)    default 0                                    null,
    disable_xmltv_restreamer              tinyint(1)    default 0                                    null,
    disable_playlist_restreamer           tinyint(1)    default 0                                    null,
    mag_load_all_channels                 tinyint(1)    default 0                                    null,
    connection_sync_timer                 int           default 1                                    null,
    segment_wait_time                     int           default 20                                   null,
    total_users                           int           default 0                                    null,
    dts_legacy_ffmpeg                     tinyint(1)    default 0                                    null,
    allow_cdn_access                      tinyint(1)    default 0                                    null,
    disable_mag_token                     tinyint(1)    default 0                                    null,
    ondemand_balance_equal                tinyint(1)    default 0                                    null,
    update_data                           mediumtext                                                 null,
    dashboard_status                      tinyint(1)    default 1                                    null,
    on_demand_checker                     tinyint(1)    default 0                                    null,
    on_demand_scan_time                   int(16)       default 3600                                 null,
    on_demand_max_probe                   int(16)       default 5                                    null,
    on_demand_scan_keep                   int(16)       default 604800                               null,
    parse_type                            varchar(12)   default 'ptn'                                null,
    fallback_parser                       tinyint(1)    default 0                                    null,
    alternative_titles                    tinyint(1)    default 0                                    null,
    search_items                          int(3)        default 20                                   null,
    enable_search                         tinyint       default 1                                    null,
    modal_edit                            tinyint(1)    default 1                                    null,
    group_buttons                         tinyint(1)    default 1                                    null,
    license                               varchar(32)                                                null,
    stop_failures                         tinyint(3)    default 3                                    null,
    restreamer_bypass_proxy               tinyint(1)    default 0                                    null,
    mysql_sleep_kill                      int           default 21600                                null,
    reissues                              mediumtext                                                 null,
    status_uuid                           varchar(512)                                               null,
    threshold_cpu                         tinyint(3)    default 67                                   null,
    threshold_mem                         tinyint(3)    default 67                                   null,
    threshold_disk                        tinyint(3)    default 67                                   null,
    threshold_network                     tinyint(3)    default 67                                   null,
    threshold_clients                     tinyint(3)    default 67                                   null,
    auth_flood_seconds                    int           default 10                                   null,
    auth_flood_limit                      int           default 30                                   null,
    auth_flood_sleep                      int           default 1                                    null,
    php_loopback                          tinyint(1)    default 1                                    null,
    security_key                          varchar(256)  default ''                                   null
)
    collate = utf8_unicode_ci;

create table signals
(
    signal_id   int auto_increment
        primary key,
    pid         int               null,
    server_id   int               null,
    rtmp        tinyint default 0 null,
    time        int               null,
    custom_data mediumtext        null,
    cache       tinyint default 0 null
)
    charset = utf8;

create index server_id
    on signals (server_id);

create index time
    on signals (time);

create table streams
(
    id                   int auto_increment
        primary key,
    type                 int                                      null,
    category_id          longtext collate utf8mb4_bin             null,
    stream_display_name  mediumtext                               null,
    stream_source        mediumtext                               null,
    stream_icon          mediumtext                               null,
    notes                mediumtext                               null,
    enable_transcode     tinyint      default 0                   null,
    transcode_attributes mediumtext                               null,
    custom_ffmpeg        mediumtext                               null,
    movie_properties     mediumtext                               null,
    movie_subtitles      mediumtext                               null,
    read_native          tinyint      default 1                   null,
    target_container     text                                     null,
    stream_all           tinyint      default 0                   null,
    remove_subtitles     tinyint      default 0                   null,
    custom_sid           varchar(150)                             null,
    epg_api              int(1)       default 0                   null,
    epg_id               int                                      null,
    channel_id           varchar(255)                             null,
    epg_lang             varchar(255)                             null,
    `order`              int          default 0                   null,
    auto_restart         mediumtext                               null,
    transcode_profile_id int          default 0                   null,
    gen_timestamps       tinyint      default 1                   null,
    added                int                                      null,
    series_no            int          default 0                   null,
    direct_source        tinyint      default 0                   null,
    tv_archive_duration  int          default 0                   null,
    tv_archive_server_id int          default 0                   null,
    tv_archive_pid       int          default 0                   null,
    vframes_server_id    int          default 0                   null,
    vframes_pid          int          default 0                   null,
    movie_symlink        tinyint      default 0                   null,
    rtmp_output          tinyint      default 0                   null,
    allow_record         tinyint      default 0                   null,
    probesize_ondemand   int          default 128000              null,
    custom_map           mediumtext                               null,
    external_push        mediumtext                               null,
    delay_minutes        int          default 0                   null,
    tmdb_language        varchar(64)                              null,
    llod                 tinyint      default 0                   null,
    year                 int(4)                                   null,
    rating               float        default 0                   not null,
    plex_uuid            varchar(256) default ''                  null,
    uuid                 varchar(32)                              null,
    epg_offset           int          default 0                   null,
    updated              timestamp    default current_timestamp() null on update current_timestamp(),
    similar              mediumtext                               null,
    tmdb_id              int                                      null,
    adaptive_link        mediumtext                               null,
    title_sync           varchar(64)                              null,
    fps_restart          tinyint(1)   default 0                   null,
    fps_threshold        int          default 90                  null,
    direct_proxy         tinyint(1)   default 0                   null
)
    collate = utf8_unicode_ci;

create index channel_id
    on streams (channel_id);

create index direct_source
    on streams (direct_source);

create index enable_transcode
    on streams (enable_transcode);

create index epg_api
    on streams (epg_api);

create index epg_id
    on streams (epg_id);

create index `order`
    on streams (`order`);

create index read_native
    on streams (read_native);

create index rtmp_output
    on streams (rtmp_output);

create fulltext index search
    on streams (stream_display_name, stream_source, notes, channel_id);

create index transcode_profile_id
    on streams (transcode_profile_id);

create index type
    on streams (type);

create index uuid
    on streams (uuid);

create table streams_arguments
(
    id                     int auto_increment
        primary key,
    argument_cat           varchar(255) null,
    argument_name          varchar(255) null,
    argument_description   mediumtext   null,
    argument_wprotocol     varchar(255) null,
    argument_key           varchar(255) null,
    argument_cmd           varchar(255) null,
    argument_type          varchar(255) null,
    argument_default_value varchar(255) null
)
    collate = utf8_unicode_ci;

create table streams_categories
(
    id            int auto_increment
        primary key,
    category_type varchar(255)     null,
    category_name varchar(255)     null,
    parent_id     int    default 0 null,
    cat_order     int    default 0 null,
    is_adult      int(1) default 0 null
)
    collate = utf8_unicode_ci;

create index cat_order
    on streams_categories (cat_order);

create index category_type
    on streams_categories (category_type);

create index parent_id
    on streams_categories (parent_id);

create table streams_episodes
(
    id          int auto_increment
        primary key,
    season_num  int null,
    episode_num int null,
    series_id   int null,
    stream_id   int null
)
    charset = utf8;

create index episode_num
    on streams_episodes (episode_num);

create index season_num
    on streams_episodes (season_num);

create index series_id
    on streams_episodes (series_id);

create index stream_id
    on streams_episodes (stream_id);

create table streams_errors
(
    id        int auto_increment
        primary key,
    stream_id int          null,
    server_id int          null,
    date      int          null,
    error     varchar(500) null
)
    charset = utf8;

create index server_id
    on streams_errors (server_id);

create index stream_id
    on streams_errors (stream_id);

create table streams_logs
(
    id        int auto_increment
        primary key,
    stream_id int           null,
    server_id int           null,
    action    varchar(500)  null,
    source    varchar(1024) null,
    date      int           null
)
    charset = utf8;

create index stream_id
    on streams_logs (stream_id);

create table streams_options
(
    id          int auto_increment
        primary key,
    stream_id   int  null,
    argument_id int  null,
    value       text null
)
    collate = utf8_unicode_ci;

create index argument_id
    on streams_options (argument_id);

create index stream_id
    on streams_options (stream_id);

create table streams_series
(
    id               int auto_increment
        primary key,
    title            varchar(255)                 null,
    category_id      longtext collate utf8mb4_bin null,
    cover            varchar(255)                 null,
    cover_big        varchar(255)                 null,
    genre            varchar(255)                 null,
    plot             mediumtext                   null,
    cast             mediumtext                   null,
    rating           int                          null,
    director         varchar(255)                 null,
    release_date     varchar(255)                 null,
    last_modified    int                          null,
    tmdb_id          int                          null,
    seasons          mediumtext                   null,
    episode_run_time int          default 0       null,
    backdrop_path    mediumtext                   null,
    youtube_trailer  mediumtext                   null,
    tmdb_language    varchar(50)                  null,
    year             int(4)                       null,
    plex_uuid        varchar(256) default ''      null,
    similar          mediumtext                   null
)
    charset = utf8;

create index last_modified
    on streams_series (last_modified);

create fulltext index search
    on streams_series (title, plot, cast, director);

create table streams_servers
(
    server_stream_id    int auto_increment
        primary key,
    stream_id           int                                    null,
    server_id           int                                    null,
    parent_id           int                                    null,
    pid                 int                                    null,
    to_analyze          tinyint    default 0                   null,
    stream_status       int        default 0                   null,
    stream_started      int                                    null,
    stream_info         mediumtext                             null,
    monitor_pid         int                                    null,
    aes_pid             int                                    null,
    current_source      mediumtext                             null,
    bitrate             int                                    null,
    progress_info       mediumtext                             null,
    cc_info             mediumtext                             null,
    on_demand           tinyint    default 0                   null,
    delay_pid           int                                    null,
    delay_available_at  int                                    null,
    pids_create_channel mediumtext                             null,
    cchannel_rsources   mediumtext                             null,
    updated             timestamp  default current_timestamp() null on update current_timestamp(),
    compatible          tinyint(1) default 0                   null,
    audio_codec         varchar(64)                            null,
    video_codec         varchar(64)                            null,
    resolution          int(5)                                 null,
    ondemand_check      int(16)                                null,
    constraint stream_id_2
        unique (stream_id, server_id)
)
    collate = utf8_unicode_ci;

create index parent_id
    on streams_servers (parent_id);

create index pid
    on streams_servers (pid);

create index server_id
    on streams_servers (server_id);

create index stream_id
    on streams_servers (stream_id);

create index stream_started
    on streams_servers (stream_started);

create index stream_status
    on streams_servers (stream_status);

create index to_analyze
    on streams_servers (to_analyze);

create table streams_stats
(
    id          int(16) auto_increment
        primary key,
    stream_id   int(16)   default 0                   null,
    rank        int(16)   default 0                   null,
    time        int(16)   default 0                   null,
    connections int(16)   default 0                   null,
    users       int(16)   default 0                   null,
    type        varchar(16)                           null,
    dateadded   timestamp default current_timestamp() null
);

create table streams_types
(
    type_id     int auto_increment
        primary key,
    type_name   varchar(255) null,
    type_key    varchar(255) null,
    type_output varchar(255) null,
    live        tinyint      null
)
    collate = utf8_unicode_ci;

create index live
    on streams_types (live);

create index type_key
    on streams_types (type_key);

create index type_output
    on streams_types (type_output);

create table syskill_log
(
    id      int auto_increment
        primary key,
    process varchar(16)  null,
    pid     int          null,
    cpu     float        null,
    mem     int          null,
    reason  varchar(256) null,
    command mediumtext   null,
    date    int          null
)
    collate = utf8_unicode_ci;

create table tickets
(
    id         int auto_increment
        primary key,
    member_id  int               null,
    title      varchar(255)      null,
    status     int     default 1 null,
    admin_read tinyint default 0 null,
    user_read  tinyint default 0 null
)
    collate = utf8_unicode_ci;

create index admin_read
    on tickets (admin_read);

create index member_id
    on tickets (member_id);

create index status
    on tickets (status);

create index user_read
    on tickets (user_read);

create table tickets_replies
(
    id          int auto_increment
        primary key,
    ticket_id   int        null,
    admin_reply tinyint    null,
    message     mediumtext null,
    date        int        null
)
    collate = utf8_unicode_ci;

create index ticket_id
    on tickets_replies (ticket_id);

create table users
(
    id                int auto_increment
        primary key,
    username          varchar(50)          null,
    password          varchar(255)         null,
    email             varchar(255)         null,
    ip                varchar(255)         null,
    date_registered   int                  null,
    last_login        int                  null,
    member_group_id   int                  null,
    credits           float      default 0 null,
    notes             mediumtext           null,
    status            tinyint(2) default 1 null,
    reseller_dns      mediumtext           null,
    owner_id          int        default 0 null,
    override_packages text                 null,
    hue               varchar(50)          null,
    theme             int(1)     default 0 null,
    timezone          varchar(255)         null,
    api_key           varchar(64)          null
)
    collate = utf8_unicode_ci;

create index member_group_id
    on users (member_group_id);

create index password
    on users (password);

create fulltext index search
    on users (username, email, ip, notes, reseller_dns);

create index username
    on users (username);

create table users_credits_logs
(
    id        int auto_increment
        primary key,
    target_id int        null,
    admin_id  int        null,
    amount    float      null,
    date      int        null,
    reason    mediumtext null
)
    charset = utf8;

create index admin_id
    on users_credits_logs (admin_id);

create index target_id
    on users_credits_logs (target_id);

create table users_groups
(
    group_id                        int auto_increment
        primary key,
    group_name                      mediumtext           null,
    is_admin                        tinyint    default 0 null,
    is_reseller                     tinyint              null,
    total_allowed_gen_trials        int        default 0 null,
    total_allowed_gen_in            varchar(255)         null,
    delete_users                    tinyint    default 0 null,
    allowed_pages                   mediumtext           null,
    can_delete                      tinyint    default 1 null,
    create_sub_resellers            tinyint    default 0 null,
    create_sub_resellers_price      float      default 0 null,
    reseller_client_connection_logs tinyint    default 1 null,
    can_view_vod                    tinyint    default 1 null,
    allow_download                  tinyint    default 1 null,
    minimum_trial_credits           int(16)    default 1 null,
    allow_restrictions              tinyint    default 1 null,
    allow_change_username           tinyint    default 1 null,
    allow_change_password           tinyint    default 1 null,
    minimum_username_length         int(16)    default 8 null,
    minimum_password_length         int(16)    default 8 null,
    allow_change_bouquets           tinyint(1) default 0 null,
    notice_html                     mediumtext           null,
    subresellers                    mediumtext           null
)
    collate = utf8_unicode_ci;

create index can_delete
    on users_groups (can_delete);

create index is_admin
    on users_groups (is_admin);

create index is_reseller
    on users_groups (is_reseller);

create table users_logs
(
    id            int auto_increment
        primary key,
    owner         int                          null,
    type          varchar(255)                 null,
    action        varchar(255)                 null,
    log_id        int                          null,
    package_id    int                          null,
    cost          int(16)                      null,
    credits_after int(16)                      null,
    date          int(30)                      null,
    deleted_info  longtext collate utf8mb4_bin null
)
    collate = utf8_unicode_ci;

create table users_packages
(
    id                   int auto_increment
        primary key,
    package_name         varchar(255)                 null,
    is_addon             tinyint default 0            null,
    is_trial             tinyint default 0            null,
    is_official          tinyint default 0            null,
    trial_credits        float   default 0            null,
    official_credits     float   default 0            null,
    trial_duration       int     default 0            null,
    trial_duration_in    varchar(255)                 null,
    official_duration    int     default 0            null,
    official_duration_in varchar(255)                 null,
    groups               longtext collate utf8mb4_bin null,
    bouquets             longtext collate utf8mb4_bin null,
    addon_packages       longtext collate utf8mb4_bin null,
    is_line              tinyint default 0            null,
    is_mag               tinyint default 0            null,
    is_e2                tinyint default 0            null,
    is_restreamer        tinyint default 0            null,
    is_isplock           tinyint default 0            null,
    output_formats       longtext collate utf8mb4_bin null,
    max_connections      int     default 1            null,
    force_server_id      int     default 0            null,
    forced_country       varchar(2)                   null,
    lock_device          tinyint default 1            null,
    check_compatible     tinyint default 1            null
)
    collate = utf8_unicode_ci;

create index can_gen_e2
    on users_packages (is_e2);

create index can_gen_mag
    on users_packages (is_mag);

create index is_line
    on users_packages (is_line);

create index is_official
    on users_packages (is_official);

create index is_trial
    on users_packages (is_trial);

create table watch_categories
(
    id          int auto_increment
        primary key,
    type        int(1) default 0 null,
    genre_id    int(8) default 0 null,
    genre       varchar(64)      null,
    category_id int(8) default 0 null,
    bouquets    varchar(4096)    null
);

create table watch_folders
(
    id                   int auto_increment
        primary key,
    type                 varchar(32)                null,
    directory            varchar(2048)              null,
    rclone_dir           varchar(2048)              null,
    server_id            int(8)        default 0    null,
    category_id          int(8)        default 0    null,
    bouquets             varchar(4096) default '[]' null,
    last_run             int(32)       default 0    null,
    active               int(1)        default 1    null,
    disable_tmdb         int(1)        default 0    null,
    ignore_no_match      int(1)        default 0    null,
    auto_subtitles       int(1)        default 0    null,
    fb_bouquets          varchar(4096) default '[]' null,
    fb_category_id       int(8)        default 0    null,
    allowed_extensions   varchar(4096) default '[]' null,
    language             varchar(32)                null,
    read_native          tinyint       default 0    null,
    movie_symlink        tinyint       default 0    null,
    auto_encode          tinyint       default 1    null,
    ffprobe_input        tinyint       default 1    null,
    transcode_profile_id int           default 0    null,
    auto_upgrade         tinyint       default 0    null,
    fallback_title       tinyint       default 0    null,
    plex_ip              varchar(128)               null,
    plex_port            int(5)        default 0    null,
    plex_username        varchar(256)               null,
    plex_password        varchar(256)               null,
    plex_libraries       mediumtext                 null,
    scan_missing         tinyint       default 0    null,
    extract_metadata     tinyint       default 0    null,
    store_categories     tinyint(1)    default 0    null,
    duplicate_tmdb       tinyint(1)    default 0    null,
    check_tmdb           tinyint(1)    default 1    null,
    remove_subtitles     tinyint(1)    default 0    null,
    target_container     varchar(64)                null,
    server_add           varchar(512)               null,
    direct_proxy         tinyint(1)    default 0    null,
    plex_token           varchar(512)               null
);

create table watch_logs
(
    id        int auto_increment
        primary key,
    type      int(1)    default 0                   null,
    server_id int(8)    default 0                   null,
    filename  varchar(4096)                         null,
    status    int(1)    default 0                   null,
    stream_id int(8)    default 0                   null,
    dateadded timestamp default current_timestamp() null
);

create table watch_refresh
(
    id        int auto_increment
        primary key,
    type      int(1)    default 0                   null,
    stream_id int(16)   default 0                   null,
    status    int(8)    default 0                   null,
    dateadded timestamp default current_timestamp() null
);

