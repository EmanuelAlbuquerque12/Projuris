# ⚡ Solução Rápida para "Failed to fetch"

## 🔴 Problema

Você está recebendo o erro:
```
Erro ao buscar tarefas: Failed to fetch
```

## ✅ Solução em 3 Passos

### 1️⃣ Instalar Node.js

Se ainda não tem, baixe e instale:
**https://nodejs.org/**

Escolha a versão LTS (recomendada)

### 2️⃣ Instalar Dependências

Abra o terminal **na pasta do projeto** e execute:

```bash
npm install
```

### 3️⃣ Iniciar o Servidor

Ainda no terminal, execute:

```bash
npm start
```

Você verá:
```
🚀 SERVIDOR PROXY PROJURIS INICIADO
→ Dashboard: http://localhost:3000
```

### 4️⃣ Acessar o Dashboard

Abra seu navegador em:
**http://localhost:3000**

**Pronto!** O dashboard agora funcionará sem erros de CORS.

---

## ❓ Por que isso funciona?

O erro "Failed to fetch" acontece porque:
- O navegador bloqueia requisições diretas à API (CORS)
- A solução é usar um servidor intermediário (proxy)
- O proxy faz as requisições em seu nome
- Sem bloqueios de CORS!

---

## 📝 Comandos Úteis

**Iniciar servidor:**
```bash
npm start
```

**Parar servidor:**
```
Ctrl + C (no terminal)
```

**Verificar se está funcionando:**
Abra: http://localhost:3000/api/health

---

## ⚠️ Importante

- **Deixe o terminal aberto** enquanto usa o dashboard
- **Não feche a janela do terminal**
- Para usar novamente: `npm start` + abrir http://localhost:3000

---

## 🆘 Problemas?

### "npm não é reconhecido"
→ Instale o Node.js: https://nodejs.org/

### "porta 3000 já está em uso"
→ Algo já está usando a porta. Reinicie o computador ou mude a porta em `proxy-server.js`

### Ainda não funciona?
→ Leia o guia completo em `INSTALACAO.md`

---

## 📁 Qual arquivo usar?

- ✅ **http://localhost:3000** (após `npm start`)
  - Esta é a forma correta!
  - Sem erros de CORS

- ❌ **dashboard-realtime.html** (abrir direto)
  - Vai dar erro "Failed to fetch"
  - Não use assim!

---

**Qualquer dúvida, consulte INSTALACAO.md para mais detalhes.**
