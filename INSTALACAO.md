# 🚀 Instalação e Uso do Dashboard Projuris

## Problema: Erro "Failed to fetch"

O erro **"Failed to fetch"** ocorre quando o navegador bloqueia requisições diretas para a API do Projuris devido a restrições de **CORS** (Cross-Origin Resource Sharing).

## ✅ Solução: Servidor Proxy Local

Para resolver esse problema, criamos um servidor proxy em Node.js que faz as requisições à API do Projuris em seu nome, evitando problemas de CORS.

---

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 14 ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique a instalação: `node --version`

2. **npm** (vem junto com Node.js)
   - Verifique: `npm --version`

---

## 🔧 Instalação

### Passo 1: Abrir o Terminal

**Windows:**
- Pressione `Win + R`
- Digite `cmd` e pressione Enter
- Navegue até a pasta do projeto:
  ```cmd
  cd C:\caminho\para\Projuris
  ```

**Mac/Linux:**
- Abra o Terminal
- Navegue até a pasta do projeto:
  ```bash
  cd /caminho/para/Projuris
  ```

### Passo 2: Instalar Dependências

Execute o comando:
```bash
npm install
```

Você verá algo como:
```
added 57 packages in 3s
```

---

## ▶️ Como Usar

### Iniciar o Servidor

No terminal, execute:
```bash
npm start
```

Você verá:
```
═══════════════════════════════════════════════════════
  🚀 SERVIDOR PROXY PROJURIS INICIADO
═══════════════════════════════════════════════════════
  → Dashboard: http://localhost:3000
  → API Proxy: http://localhost:3000/api
  → Pressione Ctrl+C para parar
═══════════════════════════════════════════════════════
```

### Acessar o Dashboard

1. Abra seu navegador
2. Acesse: **http://localhost:3000**
3. O dashboard abrirá automaticamente
4. Aguarde a mensagem: "X tarefas carregadas com sucesso!"

### Parar o Servidor

- Pressione `Ctrl + C` no terminal
- Ou simplesmente feche o terminal

---

## 📁 Arquivos do Projeto

```
Projuris/
├── package.json              # Configuração do projeto Node.js
├── proxy-server.js           # Servidor proxy
├── dashboard-proxy.html      # Dashboard (versão com proxy)
├── dashboard-realtime.html   # Dashboard (versão direta - com CORS)
├── test-api-connection.html  # Teste de conexão
├── INSTALACAO.md            # Este arquivo
└── README-DASHBOARD.md       # Documentação do dashboard
```

---

## 🔍 Testando a Conexão

Antes de usar o dashboard, você pode testar a conexão:

### Método 1: Health Check
No navegador, acesse:
```
http://localhost:3000/api/health
```

Você verá:
```json
{
  "status": "ok",
  "timestamp": "2025-01-14T12:00:00.000Z",
  "tokenCached": true,
  "tokenExpiry": "2025-01-14T13:00:00.000Z"
}
```

### Método 2: Logs do Servidor
No terminal onde o servidor está rodando, você verá:
```
[AUTH] Nova requisição de autenticação
✓ Token obtido com sucesso
  Expira em: 3600 segundos

[TAREFAS] Nova requisição de tarefas
  Filtros recebidos: (nenhum)
✓ Tarefas obtidas: 150
```

---

## 🎯 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Serve o dashboard |
| `/api/health` | GET | Status do servidor |
| `/api/auth` | POST | Obtém token de autenticação |
| `/api/tarefas` | POST | Busca todas as tarefas |
| `/api/tarefa/:id` | GET | Busca tarefa específica |

---

## ⚙️ Configuração Avançada

### Alterar a Porta

Edite `proxy-server.js`:
```javascript
const PORT = 3000; // Altere para a porta desejada
```

### Adicionar Filtros Personalizados

No dashboard, localize a função `buscarTarefasDaAPI()` e adicione filtros:
```javascript
body: JSON.stringify({
    dataLimiteInicio: '2025-01-01',
    dataLimiteFim: '2025-12-31',
    // Outros filtros disponíveis na API
})
```

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

O servidor reiniciará automaticamente quando você modificar o código.

---

## ❌ Problemas Comuns

### 1. Erro: "npm não é reconhecido"

**Problema:** Node.js não está instalado ou não está no PATH

**Solução:**
- Instale o Node.js: https://nodejs.org/
- Reinicie o terminal após a instalação

### 2. Erro: "porta 3000 já está em uso"

**Problema:** Outra aplicação está usando a porta 3000

**Solução:**
- Altere a porta em `proxy-server.js`
- Ou encerre o processo que está usando a porta 3000

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <número_do_pid> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### 3. Erro: "Cannot find module 'express'"

**Problema:** Dependências não foram instaladas

**Solução:**
```bash
npm install
```

### 4. Dashboard não carrega tarefas

**Problema:** Servidor não está rodando ou credenciais inválidas

**Solução:**
1. Verifique se o servidor está rodando
2. Confira os logs no terminal
3. Teste: http://localhost:3000/api/health
4. Verifique as credenciais em `proxy-server.js`

### 5. Erro de autenticação

**Problema:** Credenciais da API podem estar incorretas

**Solução:**
1. Verifique as credenciais em `proxy-server.js`:
   ```javascript
   const API_CONFIG = {
       domain: 'servidor',
       username: 'sistemacassel@servidor.adv.br',
       password: 'CRrKrw9D63TvHi',
       // ...
   }
   ```
2. Contate o suporte do Projuris se necessário

---

## 🔐 Segurança

### ⚠️ IMPORTANTE

- **NÃO exponha este servidor à internet** sem autenticação adicional
- As credenciais estão no código para uso local apenas
- Use apenas em:
  - ✅ Localhost (127.0.0.1)
  - ✅ Rede local confiável
  - ❌ Servidor público

### Melhorias de Segurança (Opcional)

Para produção, considere:
1. Usar variáveis de ambiente para credenciais
2. Adicionar autenticação de usuário
3. Usar HTTPS
4. Implementar rate limiting
5. Adicionar logs de auditoria

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

Os logs aparecem automaticamente no terminal:
```
→ Solicitando novo token...
✓ Token obtido com sucesso
  Expira em: 3600 segundos

[TAREFAS] Nova requisição de tarefas
✓ Tarefas obtidas: 150
```

### Tipos de Logs

- `→` - Operação em andamento
- `✓` - Operação bem-sucedida
- `✗` - Erro
- `[AUTH]` - Relacionado à autenticação
- `[TAREFAS]` - Relacionado a tarefas

---

## 🆘 Suporte

### Problemas com o Dashboard
- Verifique a documentação: `README-DASHBOARD.md`
- Consulte este arquivo: `INSTALACAO.md`

### Problemas com a API do Projuris
- Contate o suporte da Softplan/Projuris
- Verifique a documentação: https://docs.projurisadv.com.br/

### Problemas com Node.js/npm
- Documentação oficial: https://nodejs.org/docs/
- Stack Overflow: https://stackoverflow.com/

---

## 📝 Checklist de Instalação

Marque cada etapa concluída:

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] Dashboard acessível (http://localhost:3000)
- [ ] Health check OK (http://localhost:3000/api/health)
- [ ] Tarefas carregando no dashboard

---

## 🎉 Pronto!

Se todos os itens do checklist estão marcados, seu dashboard está funcionando!

**Acesse:** http://localhost:3000

**Próximos passos:**
- Explore os filtros disponíveis
- Exporte relatórios em Excel
- Configure atualização automática
- Leia `README-DASHBOARD.md` para mais recursos

---

**Desenvolvido para Cassel Ruzzarin**
Versão 2.0 com Servidor Proxy
