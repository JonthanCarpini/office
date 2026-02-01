# 🧹 Como Limpar o Cache do Navegador

## ⚠️ Problema

O navegador está redirecionando para `https://algoritimo.site/auth.html` mesmo que o código esteja correto.

Isso acontece porque o navegador **armazenou em cache** uma versão antiga do arquivo JavaScript.

---

## ✅ Solução: Limpar Cache Completamente

### **Método 1: Hard Refresh (Mais Rápido)** ⭐

1. Abra o navegador em: `http://localhost:8000/auth.html`
2. Pressione as teclas:
   - **Windows/Linux:** `Ctrl + Shift + Delete`
   - **Mac:** `Cmd + Shift + Delete`
3. Selecione:
   - ✅ Cookies e dados de sites
   - ✅ Imagens e arquivos em cache
   - ✅ Dados de aplicativos hospedados
4. Período: **Todo o período**
5. Clique em **"Limpar dados"**

**OU** use o atalho rápido:
- **Chrome/Edge:** `Ctrl + Shift + R` ou `Ctrl + F5`
- **Firefox:** `Ctrl + Shift + R` ou `Ctrl + F5`

---

### **Método 2: Modo Anônimo/Privado**

1. Abra uma janela anônima:
   - **Chrome/Edge:** `Ctrl + Shift + N`
   - **Firefox:** `Ctrl + Shift + P`
2. Acesse: `http://localhost:8000/auth.html`
3. Faça login: admin / admin123

---

### **Método 3: Limpar localStorage**

1. Abra o navegador em: `http://localhost:8000/auth.html`
2. Pressione `F12` para abrir o DevTools
3. Vá na aba **"Console"**
4. Digite e pressione Enter:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

### **Método 4: Desabilitar Cache no DevTools**

1. Pressione `F12` para abrir o DevTools
2. Vá em **"Network"** (Rede)
3. Marque a opção: **"Disable cache"** (Desabilitar cache)
4. Mantenha o DevTools aberto
5. Recarregue a página: `Ctrl + R`

---

## 🔍 Verificar se Funcionou

Após limpar o cache:

1. Acesse: `http://localhost:8000/auth.html`
2. Abra o DevTools (F12) > Console
3. Você NÃO deve ver erros de `https://algoritimo.site`
4. Faça login com: admin / admin123

---

## 🐛 Ainda Redirecionando?

Se ainda estiver redirecionando, verifique:

### 1. Certifique-se que está acessando a URL correta:
```
✅ http://localhost:8000/auth.html
❌ https://algoritimo.site/auth.html
```

### 2. Verifique o arquivo hosts do Windows:
Abra: `C:\Windows\System32\drivers\etc\hosts`

Certifique-se que NÃO tem esta linha:
```
❌ 127.0.0.1 algoritimo.site
```

### 3. Verifique se o servidor está rodando:
```bash
php -S localhost:8000
```

Deve mostrar:
```
PHP 8.2.27 Development Server (http://localhost:8000) started
```

---

## 📋 Checklist Final

- [ ] Limpei o cache do navegador
- [ ] Limpei o localStorage (F12 > Console > `localStorage.clear()`)
- [ ] Servidor PHP está rodando em localhost:8000
- [ ] PDO MySQL está habilitado
- [ ] Banco de dados foi importado
- [ ] Usuário admin foi criado
- [ ] Acessei: http://localhost:8000/auth.html (não https://algoritimo.site)

---

## 🎯 Teste Rápido

Execute este comando para verificar se o servidor está respondendo:

```bash
curl http://localhost:8000/auth.html
```

Deve retornar o HTML da página de login.

---

**Após limpar o cache, o sistema deve funcionar normalmente!**
