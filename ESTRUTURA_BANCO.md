# 📊 Estrutura Completa do Banco IPTV

## Tabelas Principais (60+ tabelas)

### 👥 Gestão de Usuários e Acesso
- **users** - Usuários do sistema (admin, revendedores, clientes)
- **users_groups** - Grupos de permissões
- **login_logs** - Logs de login
- **access_codes** - Códigos de acesso

### 📺 Gestão de Linhas (Clientes)
- **lines** - Linhas de clientes IPTV
- **lines_live** - Conexões ativas em tempo real
- **lines_activity** - Histórico de atividades
- **lines_logs** - Logs de linhas
- **lines_divergence** - Detecção de divergências

### 🎬 Gestão de Streams (Conteúdo)
- **streams** - Canais/filmes/séries
- **streams_categories** - Categorias de conteúdo
- **streams_series** - Séries de TV
- **streams_episodes** - Episódios de séries
- **streams_options** - Opções de transcodificação
- **streams_servers** - Servidores por stream
- **streams_stats** - Estatísticas de streams
- **streams_errors** - Erros de streams
- **streams_logs** - Logs de streams
- **streams_arguments** - Argumentos de transcodificação
- **streams_types** - Tipos de streams

### 🖥️ Gestão de Servidores
- **servers** - Servidores de streaming
- **servers_stats** - Estatísticas de servidores
- **rtmp_ips** - IPs RTMP

### 📡 EPG (Guia de Programação)
- **epg** - EPG principal
- **epg_channels** - Canais EPG
- **epg_data** - Dados de programação
- **epg_languages** - Idiomas EPG
- **epg_api** - API EPG

### 📦 Bouquets e Pacotes
- **bouquets** - Pacotes de canais
- **profiles** - Perfis de transcodificação

### 🎮 Dispositivos MAG
- **mag_devices** - Dispositivos MAG STB
- **mag_events** - Eventos MAG
- **mag_logs** - Logs MAG
- **mag_claims** - Reivindicações MAG

### 📱 Dispositivos Enigma2
- **enigma2_devices** - Dispositivos Enigma2
- **enigma2_actions** - Ações Enigma2

### 🔒 Segurança e Bloqueios
- **blocked_ips** - IPs bloqueados
- **blocked_isps** - ISPs bloqueados
- **blocked_asns** - ASNs bloqueados
- **blocked_uas** - User Agents bloqueados
- **detect_restream** - Detecção de restream
- **detect_restream_logs** - Logs de restream
- **hmac_keys** - Chaves HMAC

### 📁 Gestão de Arquivos
- **watch_folders** - Pastas monitoradas
- **watch_logs** - Logs de monitoramento
- **watch_refresh** - Refresh de pastas
- **watch_categories** - Categorias de pastas

### 🔧 Sistema e Configurações
- **settings** - Configurações do sistema
- **crontab** - Tarefas agendadas
- **queue** - Fila de processamento
- **panel_logs** - Logs do painel
- **panel_stats** - Estatísticas do painel
- **mysql_syslog** - Logs MySQL
- **signals** - Sinais do sistema
- **syskill_log** - Logs de processos

### 📊 Provedores e Integrações
- **providers** - Provedores de conteúdo
- **providers_streams** - Streams de provedores

### 🎥 Gravações e VOD
- **recordings** - Gravações
- **ondemand_check** - Verificação sob demanda

### 🎫 Suporte
- **tickets** - Tickets de suporte
- **tickets_replies** - Respostas de tickets

### 🔌 Dispositivos de Saída
- **output_devices** - Dispositivos de saída
- **output_formats** - Formatos de saída

---

## Módulos do Painel Office

### 1. Dashboard
- Estatísticas gerais
- Gráficos de uso
- Alertas e notificações
- Atividades recentes

### 2. Gestão de Usuários
- Listar/Criar/Editar/Deletar usuários
- Grupos e permissões
- Logs de acesso
- Códigos de acesso

### 3. Gestão de Linhas (Clientes)
- Listar/Criar/Editar/Deletar linhas
- Conexões ativas
- Histórico de atividades
- Detecção de restream
- Estatísticas por linha

### 4. Gestão de Streams
- Listar/Criar/Editar/Deletar streams
- Categorias
- Séries e episódios
- Transcodificação
- Estatísticas e erros

### 5. Gestão de Servidores
- Listar/Criar/Editar/Deletar servidores
- Monitoramento em tempo real
- Estatísticas de recursos
- Load balancing

### 6. EPG
- Gerenciar canais EPG
- Importar/Exportar EPG
- Configurar fontes EPG
- Idiomas

### 7. Bouquets
- Criar pacotes de canais
- Atribuir a linhas
- Gerenciar permissões

### 8. Dispositivos
- MAG STB
- Enigma2
- Dispositivos de saída

### 9. Segurança
- Bloqueios (IP, ISP, ASN, UA)
- Detecção de restream
- Chaves HMAC
- Logs de segurança

### 10. Provedores
- Gerenciar provedores
- Importar streams
- Sincronização

### 11. Sistema
- Configurações gerais
- Crontab
- Fila de processamento
- Logs do sistema

### 12. Suporte
- Tickets
- Respostas
- Histórico

### 13. Relatórios
- Relatórios de uso
- Relatórios financeiros
- Exportação de dados

---

## Prioridades de Implementação

### Fase 1 (Essencial)
1. Dashboard funcional
2. Gestão de Usuários
3. Gestão de Linhas
4. Gestão de Streams
5. Gestão de Servidores

### Fase 2 (Importante)
6. EPG
7. Bouquets
8. Dispositivos MAG
9. Segurança e Bloqueios

### Fase 3 (Complementar)
10. Provedores
11. Sistema e Configurações
12. Suporte
13. Relatórios
