# 🔧 Solução para Erro de Importação do car.sql

## ❌ Erro Encontrado

```
#1118 - Tamanho de linha grande demais. O máximo tamanho de linha, não contando BLOBs, é 65535.
```

Este erro ocorre porque algumas tabelas do `car.sql` têm muitos campos VARCHAR grandes que excedem o limite de 65535 bytes por linha do MySQL.

---

## ✅ Solução Rápida

### **Opção 1: Importar Ignorando Erros (Recomendado)**

1. Abra o phpMyAdmin: **http://localhost/phpmyadmin**
2. Clique em **"Importar"**
3. Selecione o arquivo `car.sql`
4. **IMPORTANTE:** Role até o final da página
5. Marque a opção: **"Ignorar erros de SQL"** ou **"Continue on error"**
6. Clique em **"Executar"**

A importação vai pular a tabela `watch_folders` e criar todas as outras tabelas normalmente.

---

### **Opção 2: Corrigir a Tabela Manualmente**

Após importar o `car.sql` com erros ignorados:

1. No phpMyAdmin, clique na aba **"SQL"**
2. Execute o script `fix_watch_folders.sql` que criei
3. Isso vai criar a tabela `watch_folders` com a estrutura corrigida

---

### **Opção 3: Editar o car.sql Antes de Importar**

Se preferir corrigir o arquivo antes de importar:

1. Abra o arquivo `car.sql` em um editor de texto
2. Localize a linha 1821: `create table watch_folders`
3. Substitua os seguintes campos:
   - `directory varchar(2048)` → `directory TEXT`
   - `rclone_dir varchar(2048)` → `rclone_dir TEXT`
   - `bouquets varchar(4096)` → `bouquets TEXT`
   - `fb_bouquets varchar(4096)` → `fb_bouquets TEXT`
   - `allowed_extensions varchar(4096)` → `allowed_extensions TEXT`
   - `server_add varchar(512)` → `server_add TEXT`
   - `plex_token varchar(512)` → `plex_token TEXT`
4. Salve o arquivo
5. Importe normalmente

---

## 🎯 Qual Opção Escolher?

- **Opção 1** - Mais rápida, a tabela `watch_folders` não é essencial para o painel funcionar
- **Opção 2** - Cria a tabela corrigida depois
- **Opção 3** - Mais trabalhosa, mas garante que tudo seja importado

---

## ⚠️ Importante

A tabela `watch_folders` é usada para monitoramento de pastas e importação automática de conteúdo. 
**O painel office vai funcionar normalmente sem ela**, pois as funcionalidades principais são:

- ✅ Gerenciar usuários
- ✅ Gerenciar linhas
- ✅ Gerenciar streams
- ✅ Gerenciar servidores
- ✅ Dashboard e estatísticas

---

## 📋 Próximos Passos

Após importar o `car.sql` (com ou sem a tabela watch_folders):

1. Execute o script `create_admin.sql` para criar o usuário admin
2. Acesse: **http://localhost:8000/auth.html**
3. Login: **admin** / **admin123**

---

## 🐛 Outras Tabelas com Problema?

Se outras tabelas apresentarem o mesmo erro, o princípio é o mesmo:
- Converta campos `VARCHAR(>1000)` para `TEXT` ou `MEDIUMTEXT`
- Ou ignore os erros na importação

---

**Recomendação:** Use a **Opção 1** para começar a testar o painel rapidamente!
