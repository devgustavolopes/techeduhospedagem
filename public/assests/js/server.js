// Arquivo: api/server.js
// ---------------------------------------------------------------------
// CONFIGURAÇÃO DO JSON SERVER COMO FUNÇÃO SERVERLESS PARA O VERCEL
// ---------------------------------------------------------------------

// 1. Importa o módulo json-server
const jsonServer = require('json-server');

// 2. Cria o servidor Express
const server = jsonServer.create();

// 3. Define seu arquivo de dados. 
// Certifique-se de que o arquivo 'db.json' exista na raiz do seu projeto.
const router = jsonServer.router('db.json'); 

// 4. Configura Middlewares Padrão (inclui o CORS)
// O objeto { noCors: false } garante que você possa acessar de outros domínios
const middlewares = jsonServer.defaults({
    noCors: false 
});

// 5. Aplica os Middlewares
server.use(middlewares);

// 6. Aplica o roteador (que contém seus dados)
server.use(router);

// 7. Exporta o servidor. ISSO É CRÍTICO para o Vercel entender que esta é a sua Serverless Function.
module.exports = server;