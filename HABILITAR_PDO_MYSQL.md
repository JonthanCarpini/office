# 🔧 Como Habilitar PDO MySQL no PHP

## ❌ Erro Encontrado

```
could not find driver
```

Este erro significa que a extensão PDO MySQL não está habilitada no PHP.

---

## ✅ Solução

### **Método 1: Editar php.ini (Recomendado)**

1. **Localize o arquivo php.ini:**
   - Caminho: `C:\php\php.ini`
   - Ou execute: `php --ini` para ver o caminho

2. **Abra o arquivo com um editor de texto:**
   - Notepad++, VSCode, ou Notepad

3. **Procure estas linhas (Ctrl+F):**
   ```ini
   ;extension=pdo_mysql
   ;extension=mysqli
   ```

4. **Remova o ponto e vírgula (;) do início:**
   ```ini
   extension=pdo_mysql
   extension=mysqli
   ```

5. **Salve o arquivo**

6. **Teste se funcionou:**
   ```bash
   php test_db.php
   ```

---

### **Método 2: Usar o PHP do XAMPP**

Se você tem o XAMPP instalado, use o PHP dele que já vem configurado:

1. **Localize o PHP do XAMPP:**
   - Geralmente em: `C:\xampp\php\php.exe`

2. **Adicione ao PATH do Windows:**
   - Painel de Controle > Sistema > Configurações Avançadas
   - Variáveis de Ambiente
   - Edite a variável PATH
   - Adicione: `C:\xampp\php`
   - Clique OK

3. **Abra um novo terminal e teste:**
   ```bash
   php --version
   php test_db.php
   ```

---

### **Método 3: Verificar se as DLLs existem**

As extensões PDO precisam dos arquivos DLL:

1. Verifique se existem em `C:\php\ext\`:
   - `php_pdo_mysql.dll`
   - `php_mysqli.dll`

2. Se não existirem, você precisa reinstalar o PHP ou baixar as DLLs

---

## 🧪 Testar a Configuração

Após habilitar, execute:

```bash
php test_db.php
```

Você deve ver:
```
✓ Conexão com banco estabelecida!
```

---

## 🚀 Próximos Passos

Após habilitar o PDO MySQL:

1. **Importe o banco de dados:**
   - Acesse: http://localhost/phpmyadmin
   - Importe o `car.sql` (ignorando erros)

2. **Crie o usuário admin:**
   - Execute o script `create_admin.sql`

3. **Inicie o servidor:**
   ```bash
   php -S localhost:8000
   ```

4. **Acesse o painel:**
   - http://localhost:8000/auth.html
   - Login: admin / admin123

---

## 🐛 Ainda com Problemas?

### Erro: "extension_dir not set"
Adicione no php.ini:
```ini
extension_dir = "C:\php\ext"
```

### Erro: "Unable to load dynamic library"
- Verifique se os arquivos DLL existem em `C:\php\ext\`
- Reinstale o PHP se necessário

### Usar XAMPP é mais fácil!
O XAMPP já vem com tudo configurado:
- PHP com todas as extensões
- MySQL/MariaDB
- phpMyAdmin
- Apache

---

## 📝 Verificar Extensões Habilitadas

Para ver todas as extensões habilitadas:

```bash
php -m
```

Procure por:
- PDO
- pdo_mysql
- mysqli

Se não aparecerem, a extensão não está habilitada corretamente.
