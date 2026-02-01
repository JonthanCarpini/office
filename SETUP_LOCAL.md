# 🚀 Guia de Configuração Local

## Passo 1: Configurar o Banco de Dados

### Opção A: Usando XAMPP/WAMP
1. Inicie o Apache e MySQL no painel de controle
2. Acesse phpMyAdmin: `http://localhost/phpmyadmin`
3. Clique em "Importar"
4. Selecione o arquivo `setup_test.sql`
5. Clique em "Executar"

### Opção B: Usando MySQL via linha de comando
```bash
mysql -u root -p < setup_test.sql
```

### Opção C: Criar manualmente
1. Abra o MySQL Workbench ou outro cliente
2. Copie e execute o conteúdo de `setup_test.sql`

## Passo 2: Configurar a API

Edite o arquivo `api/config.php` e configure:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');              // Seu usuário MySQL
define('DB_PASS', '');                  // Sua senha MySQL (vazio se for root sem senha)
define('DB_NAME', 'iptv_database');
```

## Passo 3: Iniciar o Servidor PHP

Abra o terminal na pasta do projeto e execute:

```bash
php -S localhost:8000
```

## Passo 4: Acessar o Painel

Abra seu navegador e acesse:

```
http://localhost:8000/auth.html
```

### Credenciais de Teste:
- **Usuário:** admin
- **Senha:** admin123

## 🔧 Solução de Problemas

### Erro: "Connection failed"
- Verifique se o MySQL está rodando
- Confirme as credenciais em `api/config.php`
- Teste a conexão: `mysql -u root -p`

### Erro: "No token provided"
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Limpe o localStorage: F12 > Console > `localStorage.clear()`

### Erro: "Class 'PDO' not found"
- Habilite a extensão PDO no php.ini:
  ```
  extension=pdo_mysql
  ```
- Reinicie o servidor PHP

### Porta 8000 já está em uso
Use outra porta:
```bash
php -S localhost:8080
```

## 📊 Estrutura do Banco de Teste

O script `setup_test.sql` cria:

- ✅ Banco de dados: `iptv_database`
- ✅ Usuário admin com senha: `admin123`
- ✅ 2 linhas de teste
- ✅ 2 streams de exemplo
- ✅ 2 servidores de exemplo

## 🎯 Próximos Passos

Após o login bem-sucedido:

1. Explore o Dashboard
2. Acesse "Usuários" para ver o admin
3. Acesse "Linhas" para ver as linhas de teste
4. Acesse "Streams" para ver os canais
5. Acesse "Servidores" para ver os servidores

## 🔐 Segurança

**IMPORTANTE:** Este é um ambiente de TESTE!

- Altere a senha do admin após o primeiro login
- Altere o `JWT_SECRET` em `api/config.php`
- Não use em produção sem configurar SSL/HTTPS
- Configure permissões adequadas nos arquivos

## 📝 Notas

- O servidor PHP embutido é apenas para desenvolvimento
- Para produção, use Apache ou Nginx
- Mantenha o PHP e MySQL atualizados
- Faça backups regulares do banco de dados
