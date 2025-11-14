/**
 * Servidor Proxy para API do Projuris
 *
 * Este servidor resolve problemas de CORS permitindo que o dashboard
 * faça requisições através dele ao invés de diretamente para a API.
 *
 * Como usar:
 * 1. Instalar dependências: npm install
 * 2. Iniciar servidor: node proxy-server.js
 * 3. Abrir dashboard em: http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração da API Projuris
const API_CONFIG = {
    domain: 'servidor',
    username: 'sistemacassel@servidor.adv.br',
    password: 'CRrKrw9D63TvHi',
    apiUrl: 'https://api.projurisadv.com.br/adv-service',
    tokenUrl: 'https://apigw.projurisadv.com.br/auth/token',
    clientId: 'api_cliente_codigo_12964',
    clientSecret: '@2022@8da6df1ca4914b04a5df3566278e5393'
};

// Cache do token
let tokenCache = {
    token: null,
    expiry: null
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve arquivos estáticos (HTML)

// Função para obter token
async function getToken() {
    // Retorna token do cache se ainda válido
    if (tokenCache.token && Date.now() < tokenCache.expiry - 60000) {
        console.log('✓ Usando token do cache');
        return tokenCache.token;
    }

    console.log('→ Solicitando novo token...');

    const auth = Buffer.from(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', API_CONFIG.username);
    params.append('password', API_CONFIG.password);

    try {
        const response = await fetch(API_CONFIG.tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('✗ Erro na autenticação:', response.status, error);
            throw new Error(`Autenticação falhou: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // Atualizar cache
        tokenCache.token = data.access_token;
        tokenCache.expiry = Date.now() + (data.expires_in * 1000);

        console.log('✓ Token obtido com sucesso');
        console.log('  Expira em:', data.expires_in, 'segundos');

        return tokenCache.token;
    } catch (error) {
        console.error('✗ Erro ao obter token:', error);
        throw error;
    }
}

// Endpoint para autenticação
app.post('/api/auth', async (req, res) => {
    try {
        console.log('\n[AUTH] Nova requisição de autenticação');
        const token = await getToken();

        res.json({
            success: true,
            access_token: token,
            token_type: 'Bearer',
            expires_in: Math.floor((tokenCache.expiry - Date.now()) / 1000)
        });
    } catch (error) {
        console.error('[AUTH] Erro:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para buscar tarefas
app.post('/api/tarefas', async (req, res) => {
    try {
        console.log('\n[TAREFAS] Nova requisição de tarefas');
        const token = await getToken();

        const filtros = req.body || {};
        console.log('  Filtros recebidos:', Object.keys(filtros).length > 0 ? filtros : '(nenhum)');

        const response = await fetch(`${API_CONFIG.apiUrl}/tarefa/consulta-sem-paginacao`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(filtros)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('✗ Erro ao buscar tarefas:', response.status, error);
            throw new Error(`Busca de tarefas falhou: ${response.status}`);
        }

        const data = await response.json();

        // Identificar array de tarefas
        let tarefas = [];
        if (data.tarefaConsultaWs) {
            tarefas = data.tarefaConsultaWs;
        } else if (Array.isArray(data)) {
            tarefas = data;
        }

        console.log('✓ Tarefas obtidas:', tarefas.length);

        res.json({
            success: true,
            tarefas: tarefas,
            total: tarefas.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[TAREFAS] Erro:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para buscar tarefa específica
app.get('/api/tarefa/:id', async (req, res) => {
    try {
        const tarefaId = req.params.id;
        console.log(`\n[TAREFA] Buscando tarefa ${tarefaId}`);

        const token = await getToken();

        const response = await fetch(`${API_CONFIG.apiUrl}/tarefa/${tarefaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar tarefa: ${response.status}`);
        }

        const data = await response.json();
        console.log('✓ Tarefa obtida');

        res.json({
            success: true,
            tarefa: data
        });
    } catch (error) {
        console.error('[TAREFA] Erro:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        tokenCached: !!tokenCache.token,
        tokenExpiry: tokenCache.expiry ? new Date(tokenCache.expiry).toISOString() : null
    });
});

// Rota principal - serve o dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-proxy.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🚀 SERVIDOR PROXY PROJURIS INICIADO');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  → Dashboard: http://localhost:${PORT}`);
    console.log(`  → API Proxy: http://localhost:${PORT}/api`);
    console.log('  → Pressione Ctrl+C para parar');
    console.log('═══════════════════════════════════════════════════════\n');
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
    console.error('\n✗ Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('\n✗ Promise rejeitada:', reason);
});
