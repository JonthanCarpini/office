# 🚀 Instalação Rápida - Painel Office IPTV

## ⚠️ IMPORTANTE
Este painel foi desenvolvido para gerenciar um banco de dados IPTV **EXISTENTE**. 
Você deve ter o banco de dados `car.sql` já configurado.

---

## 📋 Pré-requisitos

- ✅ PHP 8.0+ instalado
- ✅ XAMPP com MySQL rodando
- ✅ Arquivo `car.sql` (estrutura do banco IPTV)

---

## 🔧 Instalação em 3 Passos

### **Passo 1: Importar o Banco de Dados Existente**

1. Certifique-se que o MySQL está rodando no XAMPP
2. Acesse: **http://localhost/phpmyadmin**
3. Clique em **"Importar"**
4. Selecione o arquivo: `car.sql`
5. Clique em **"Executar"**

⏱️ *Aguarde a importação concluir (pode demorar alguns minutos)*

---

### **Passo 2: Criar Usuário Administrador**

Após importar o `car.sql`, execute o script para criar o admin:

1. No phpMyAdmin, clique na aba **"SQL"**
2. Abra o arquivo `create_admin.sql`
3. Copie todo o conteúdo
4. Cole no phpMyAdmin e clique em **"Executar"**

**OU** importe o arquivo:
- Clique em "Importar" > Escolher arquivo > `create_admin.sql` > Executar

---

### **Passo 3: Iniciar o Servidor e Acessar**

1. Abra o terminal na pasta do projeto:
   ```bash
   cd C:\Users\admin\Documents\Projetos\painel_office
   ```

2. Inicie o servidor PHP:
   ```bash
   php -S localhost:8000
   ```

3. Acesse no navegador:
   ```
   http://localhost:8000/auth.html
   ```

4. Faça login com:
   - **Usuário:** `admin`
   - **Senha:** `admin123`

---

## 🎯 O que o Painel Faz

Este painel permite gerenciar o banco de dados IPTV existente:

- ✅ **Dashboard** - Estatísticas em tempo real
- ✅ **Usuários** - Gerenciar usuários do sistema
- ✅ **Linhas** - Gerenciar linhas de clientes
- ✅ **Streams** - Gerenciar canais e conteúdo
- ✅ **Servidores** - Monitorar servidores
- ✅ **Categorias** - Organizar conteúdo
- ✅ **EPG** - Guia de programação
- ✅ **Atividades** - Logs e histórico

---

## 🔐 Configuração do Banco

O arquivo `api/config.php` já está configurado para XAMPP:

```php
DB_HOST: localhost
DB_USER: root
DB_PASS: (vazio)
DB_NAME: iptv_database
```

Se seu banco tiver outro nome ou credenciais diferentes, edite o arquivo `api/config.php`.

---

## ❌ Arquivos que NÃO devem ser usados

- ~~`setup_test.sql`~~ - Apenas para referência, NÃO execute
- ~~`install.sql`~~ - Apenas para referência, NÃO execute

**Use apenas:**
- ✅ `car.sql` - Banco de dados completo
- ✅ `create_admin.sql` - Criar usuário admin

---

## 🐛 Solução de Problemas

### Erro: "Connection failed"
- Verifique se o MySQL está rodando no XAMPP
- Confirme que o banco `iptv_database` foi criado
- Verifique as credenciais em `api/config.php`

### Erro: "Invalid credentials"
- Execute o script `create_admin.sql` novamente
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Use: admin / admin123

### Erro: "Table doesn't exist"
- O banco `car.sql` não foi importado corretamente
- Reimporte o arquivo `car.sql` no phpMyAdmin

### Porta 8000 em uso
Use outra porta:
```bash
php -S localhost:8080
```

---

## 🔒 Segurança

**IMPORTANTE para produção:**

1. Altere a senha do admin após primeiro login
2. Altere o `JWT_SECRET` em `api/config.php`
3. Configure SSL/HTTPS
4. Use Apache ou Nginx (não o servidor PHP embutido)
5. Configure firewall e permissões adequadas

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do PHP
2. Verifique os logs do MySQL no XAMPP
3. Abra o console do navegador (F12) para ver erros JavaScript

---

**Versão:** 1.0.0  
**Última Atualização:** Fevereiro 2026
