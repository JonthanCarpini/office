# Painel IPTV Office

Sistema completo de gerenciamento para serviços IPTV/Streaming com interface moderna e intuitiva.

## 🚀 Características

- **Dashboard Completo**: Visualização em tempo real de estatísticas e métricas
- **Gerenciamento de Usuários**: Controle total de usuários e permissões
- **Gerenciamento de Linhas**: Criação e controle de linhas de acesso
- **Gerenciamento de Streams**: Controle de canais, filmes e séries
- **Gerenciamento de Servidores**: Monitoramento e controle de servidores
- **Sistema de Autenticação**: Login seguro com JWT
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Design Moderno**: Interface clean com Tailwind CSS

## 📋 Requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor Web (Apache/Nginx)
- Extensões PHP: PDO, PDO_MySQL, JSON

## 🔧 Instalação

1. **Clone ou copie os arquivos para seu servidor web**

2. **Configure o banco de dados**
   - Importe o arquivo `car.sql` para criar a estrutura do banco
   - Edite `api/config.php` e configure as credenciais do banco:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'seu_usuario');
   define('DB_PASS', 'sua_senha');
   define('DB_NAME', 'iptv_database');
   ```

3. **Configure a chave JWT**
   - No arquivo `api/config.php`, altere a chave secreta:
   ```php
   define('JWT_SECRET', 'sua_chave_secreta_unica_aqui');
   ```

4. **Crie um usuário administrador**
   ```sql
   INSERT INTO users (username, password, email, member_group_id, status, date_registered) 
   VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 1, 1, UNIX_TIMESTAMP());
   ```
   Senha padrão: `password` (altere após o primeiro login)

5. **Configure permissões**
   ```bash
   chmod -R 755 painel_office/
   chmod -R 777 painel_office/api/
   ```

6. **Acesse o painel**
   - Abra seu navegador e acesse: `http://seu-dominio.com/auth.html`
   - Faça login com as credenciais criadas

## 📁 Estrutura de Arquivos

```
painel_office/
├── api/
│   ├── config.php              # Configurações e classes base
│   ├── auth.php                # Autenticação
│   ├── dashboard/
│   │   ├── stats.php           # Estatísticas do dashboard
│   │   └── activities.php      # Atividades recentes
│   ├── users/
│   │   └── list.php            # Listagem de usuários
│   ├── lines/
│   │   └── list.php            # Listagem de linhas
│   ├── streams/
│   │   └── list.php            # Listagem de streams
│   └── servers/
│       └── list.php            # Listagem de servidores
├── css/
│   └── style.css               # Estilos customizados
├── js/
│   └── app.js                  # JavaScript principal
├── auth.html                   # Página de login
├── index.html                  # Dashboard principal
├── car.sql                     # Estrutura do banco de dados
└── README.md                   # Este arquivo
```

## 🔐 Segurança

- Todas as senhas são armazenadas com hash bcrypt
- Autenticação via JWT com expiração configurável
- Proteção contra SQL Injection via PDO Prepared Statements
- Sanitização de inputs
- Headers de segurança configurados

## 🎨 Tecnologias Utilizadas

### Frontend
- HTML5
- Tailwind CSS
- JavaScript (Vanilla)
- Font Awesome Icons
- Chart.js

### Backend
- PHP 7.4+
- MySQL
- PDO
- JWT Authentication

## 📊 Módulos Disponíveis

### Dashboard
- Estatísticas em tempo real
- Gráficos de conexões
- Streams mais assistidos
- Atividades recentes
- Status do sistema

### Usuários
- Listagem com paginação
- Busca e filtros
- Gerenciamento de grupos
- Controle de créditos

### Linhas
- Criação e edição
- Controle de expiração
- Gerenciamento de conexões
- Histórico de atividades

### Streams
- Gerenciamento de canais Live TV
- Filmes e séries
- Categorização
- EPG integrado

### Servidores
- Monitoramento em tempo real
- Status de CPU, memória e disco
- Controle de conexões
- Balanceamento de carga

## 🔄 Atualizações Futuras

- [ ] CRUD completo para todos os módulos
- [ ] Sistema de tickets
- [ ] Relatórios avançados
- [ ] Exportação de dados
- [ ] API REST completa
- [ ] Notificações em tempo real
- [ ] Tema escuro/claro
- [ ] Multi-idioma

## 🐛 Solução de Problemas

### Erro de conexão com banco de dados
- Verifique as credenciais em `api/config.php`
- Certifique-se que o MySQL está rodando
- Verifique se o banco de dados foi criado

### Erro 401 - Unauthorized
- Limpe o localStorage do navegador
- Verifique se o JWT_SECRET está configurado
- Faça login novamente

### Erro 500 - Internal Server Error
- Verifique os logs do PHP
- Certifique-se que as extensões PDO estão habilitadas
- Verifique permissões dos arquivos

## 📝 Licença

Este projeto é proprietário e confidencial.

## 👨‍💻 Suporte

Para suporte, entre em contato através do sistema de tickets interno.

---

**Versão**: 1.0.0  
**Última Atualização**: 2024
