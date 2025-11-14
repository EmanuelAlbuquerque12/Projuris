# Dashboard de Tarefas Projuris - Tempo Real

Dashboard interativo que exibe tarefas do Projuris em tempo real, com atualização automática e múltiplas visualizações.

## Características

### Funcionalidades Principais

- **Atualização em Tempo Real**: Busca automática de tarefas da API do Projuris a cada 30 segundos
- **Autenticação OAuth2**: Conexão segura com a API usando credenciais configuradas
- **Indicador de Status**: Mostra visualmente o status da conexão (online/offline)
- **Última Atualização**: Exibe o horário da última sincronização com a API

### Visualizações

1. **Resumo de Prazos**
   - Total de tarefas
   - Tarefas em atraso
   - Tarefas concluídas
   - Tarefas em aberto
   - Taxa de conclusão com gráfico

2. **Gráficos**
   - Distribuição por Status (Pizza)
   - Tarefas por Tipo (Barras)

3. **Tabelas Detalhadas**
   - Tarefas Adiantadas (concluídas antes do prazo)
   - Tarefas em Atraso (com dias de atraso)
   - Lista Completa de Tarefas (todas as informações)

### Filtros Avançados

- **Responsáveis**: Seleção múltipla com checkbox
- **Situação**: Filtro por status da tarefa
- **Tipos de Tarefas**: Filtro por tipo
- **Tarefas Relacionadas**: Filtro por tarefas relacionadas
- **Grupos de Trabalho**: Filtro por grupo
- **Datas**: Filtro por período de criação e data fatal

### Recursos Adicionais

- **Ordenação**: Clique nos cabeçalhos das tabelas para ordenar
- **Exportação Excel**: Exporta dados filtrados em 3 abas (Lista Completa, Atrasos, Adiantadas)
- **Seções Retráteis**: Oculte/exiba seções conforme necessário
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela

## Configuração

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Acesso à internet (para bibliotecas CDN)
- Credenciais válidas da API do Projuris

### Credenciais da API

As credenciais estão configuradas diretamente no código JavaScript:

```javascript
const API_CONFIG = {
    domain: 'servidor',
    username: 'sistemacassel@servidor.adv.br',
    password: 'CRrKrw9D63TvHi',
    apiUrl: 'https://api.projurisadv.com.br/adv-service',
    tokenUrl: 'https://apigw.projurisadv.com.br/auth/token',
    clientId: 'api_cliente_codigo_12964',
    clientSecret: '@2022@8da6df1ca4914b04a5df3566278e5393'
};
```

### Instalação

1. Faça o download do arquivo `dashboard-realtime.html`
2. Abra o arquivo em um navegador web
3. O dashboard irá automaticamente:
   - Conectar-se à API do Projuris
   - Obter um token de autenticação
   - Buscar as tarefas
   - Atualizar a cada 30 segundos

## Como Usar

### Primeira Visualização

1. Abra o arquivo HTML no navegador
2. Aguarde a mensagem "X tarefas carregadas com sucesso!"
3. O status de conexão deve mostrar "Conectado" (indicador verde)

### Navegação

#### Filtros

1. **Responsáveis**: Marque/desmarque os responsáveis desejados
   - Use o botão "Selecionar/Desselecionar Todos" para facilitar
2. **Situação**: Selecione as situações que deseja visualizar
3. **Tipos e Grupos**: Use os dropdowns para filtrar
4. **Datas**: Preencha os campos para filtrar por período
5. **Limpar Filtros**: Remove todos os filtros aplicados

#### Tabelas

- **Tarefas Adiantadas**: Mostra tarefas concluídas antes do prazo fatal
  - Tempo Decorrido: dias entre criação e conclusão
  - Tempo Otimizado: dias economizados (prazo fatal - data conclusão)

- **Tarefas em Atraso**: Lista tarefas com prazo fatal vencido
  - Dias em Atraso: quanto tempo passou do prazo
  - Ordenado por padrão pelos dias de atraso (decrescente)

- **Lista Completa**: Todas as tarefas com todos os campos
  - Oculta por padrão (clique em "Mostrar/Ocultar Tabela")

#### Ordenação

- Clique no cabeçalho de qualquer coluna para ordenar
- Primeiro clique: ordem crescente (↑)
- Segundo clique: ordem decrescente (↓)
- Ícone azul indica coluna ativa

#### Exportação

1. Aplique os filtros desejados
2. Clique em "Exportar Excel"
3. O arquivo será baixado com:
   - Aba "Lista Completa": todas as tarefas filtradas
   - Aba "Tarefas em Atraso": apenas as atrasadas
   - Aba "Tarefas Adiantadas": apenas as adiantadas
4. Nome do arquivo: `tarefas_projuris_YYYYMMDD_HHMM.xlsx`

### Atualização Automática

- **Ativada por padrão**: Atualiza a cada 30 segundos
- **Desativar**: Use o toggle "Atualização automática" no topo
- **Atualização Manual**: Clique no botão "Atualizar" (ícone de refresh)
- **Última Atualização**: Exibe horário da última sincronização

## Mapeamento de Campos

Os campos da API do Projuris são mapeados conforme abaixo:

| Campo Dashboard | Campo API Projuris | Observações |
|-----------------|-------------------|-------------|
| Pasta | `chaveModulo` / `modulo.chave` | Identificador do módulo |
| Identificador | `identificador` | Identificador da tarefa |
| Responsáveis | `usuarioResponsaveis` | String concatenada |
| Tipo | `nomeTarefaTipo` | Nome do tipo de tarefa |
| Data de criação | `dataInclusao` | Data de inclusão |
| Data base | - | Não disponível na consulta básica |
| Data prevista | `dataConclusaoPrevista` | Data prevista de conclusão |
| Data fatal | `dataLimite` | Data limite |
| Data da conclusão | `dataConclusao` | Data de conclusão |
| Grupos | `gruposResponsaveis` | Grupos de trabalho |
| Situação | `situacao` | Situação da tarefa |

## Determinação de Status

O dashboard categoriza as tarefas em 3 status:

1. **Concluído** (Verde 🟢)
   - Situação contém "concluída com sucesso" ou "concluída sem sucesso"
   - OU flag `flagSituacaoConcluida` = true

2. **Atraso** (Vermelho 🔴)
   - Data Fatal < Data de Hoje
   - E tarefa NÃO está concluída

3. **Prazo em Aberto** (Azul 🔵)
   - Todos os demais casos

## Cálculos Especiais

### Tempo Decorrido
```
Tempo Decorrido = (Data de Conclusão OU Hoje) - Data de Criação
```

### Tempo Otimizado (Tarefas Adiantadas)
```
Tempo Otimizado = Data Fatal - Data de Conclusão
(Mostra quantos dias foram economizados)
```

### Dias em Atraso
```
Dias em Atraso = Hoje - Data Fatal
(Apenas se Data Fatal < Hoje)
```

## Troubleshooting

### Dashboard não carrega tarefas

1. **Verifique o Console do Navegador** (F12)
   - Procure por erros de autenticação
   - Verifique se há erros de CORS

2. **Credenciais Inválidas**
   - Verifique se as credenciais no código estão corretas
   - Teste as credenciais diretamente na API

3. **Problemas de Rede**
   - Verifique se há acesso à internet
   - Confirme que os domínios da API estão acessíveis

### Status mostra "Desconectado"

- A última tentativa de busca falhou
- Verifique o console do navegador para detalhes do erro
- Clique em "Atualizar" para tentar novamente

### Exportação não funciona

- Certifique-se de que há tarefas filtradas
- Verifique se a biblioteca XLSX está carregada (F12 > Console > digite `XLSX`)
- Tente em um navegador diferente

### Filtros não funcionam

- Limpe todos os filtros e tente novamente
- Recarregue a página (F5)
- Verifique se há tarefas carregadas

## Bibliotecas Utilizadas

- **Tailwind CSS** (v3): Framework CSS para estilização
- **Font Awesome** (v6): Ícones
- **Chart.js** (v4): Gráficos interativos
- **SheetJS (XLSX)** (v0.18.5): Exportação Excel

## Segurança

⚠️ **IMPORTANTE**: Este dashboard contém credenciais de API hardcoded no código JavaScript.

### Recomendações de Segurança:

1. **Não compartilhe** este arquivo com pessoas não autorizadas
2. **Não hospede** em servidores públicos sem proteção
3. **Use apenas** em ambiente local ou intranet segura
4. **Considere** implementar autenticação adicional se for hospedado

### Alternativas Mais Seguras:

Para ambientes de produção, considere:
- Backend intermediário que gerencia as credenciais
- Autenticação de usuário antes do acesso
- Uso de variáveis de ambiente
- Tokens de sessão temporários

## Customização

### Alterar Intervalo de Atualização

Localize a linha no código:
```javascript
autoRefreshInterval = setInterval(() => {
    carregarDados(false);
}, 30000); // 30000 = 30 segundos
```

Altere `30000` para o valor desejado em milissegundos:
- 15 segundos = `15000`
- 1 minuto = `60000`
- 5 minutos = `300000`

### Alterar Credenciais

Localize o objeto `API_CONFIG` no início do script e altere os valores conforme necessário.

### Adicionar Novos Filtros

1. Adicione o campo HTML no formulário de filtros
2. Adicione a lógica de filtro na função `aplicarFiltros()`
3. Atualize a função `limparFiltros()` se necessário

## Suporte

Para problemas relacionados à:
- **API do Projuris**: Contate o suporte da Softplan/Projuris
- **Dashboard**: Verifique o console do navegador e logs de erro

## Versão

- **Versão**: 2.0 (Tempo Real)
- **Data**: 2025
- **Desenvolvido para**: Cassel Ruzzarin

## Changelog

### v2.0 - Tempo Real
- Integração completa com API do Projuris
- Autenticação OAuth2 automática
- Atualização em tempo real (30 segundos)
- Indicador de status de conexão
- Remoção do upload manual de planilhas

### v1.0 - Manual
- Upload manual de planilhas Excel
- Processamento local de dados
- Filtros e visualizações básicas
