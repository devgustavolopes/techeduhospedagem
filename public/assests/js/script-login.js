// Arquivo: assets/js/login.js

// --- CONFIGURAÇÕES (CORRIGIDAS DEFINITIVAMENTE) ---
const LOGIN_URL = "login.html";
const HOME_URL = "index.html"; 
let RETURN_URL = "dashboard.html"; // Página restrita padrão
// 🚨 CORRETO: URL Padrão do JSON Server
const API_URL = (techeduvercel.vercel.app); 

// 💯 CORREÇÃO FINAL: DECLARANDO A VARIÁVEL USANDO A ROTA CONFIRMADA
const COLLECTION_NAME = '/usuarios'; 

// Objeto para o banco de dados
var db_usuarios = {};
var usuarioCorrente = {};

// Inicializa a aplicação
function initLoginApp() {
    // Carrega usuários ao iniciar qualquer página
    carregarUsuarios(() => {
        console.log('Banco de dados carregado.');
    });

    // Verifica se estamos em uma página que EXIGE login
    const path = window.location.pathname;
    const isRestricted = path.includes('dashboard.html');

    if (isRestricted) {
        // Recupera usuário da sessão
        const usuarioJSON = sessionStorage.getItem('usuarioCorrente');
        
        if (usuarioJSON) {
            usuarioCorrente = JSON.parse(usuarioJSON);
            showUserInfo();
        } else {
            // Se não tem usuário e a página é restrita, manda pro login
            window.location.href = LOGIN_URL;
        }
    }
}

// Carrega usuários da API
function carregarUsuarios(callback) {
    // 🚨 CORRETO: fetch com API_URL + COLLECTION_NAME
    fetch(`${techeduvercel.vercel.app}${COLLECTION_NAME}`) 
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
            if (callback) callback();
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            console.warn('⚠️ Erro de conexão! Verifique se a API está online ou se COLLECTION_NAME está correta.');
        });
}

// Função de Login
function loginUser(login, senha) {
    // Procura usuário no array baixado do servidor
    const user = db_usuarios.find(u => (u.login === login || u.email === login) && u.senha === senha);

    if (user) {
        usuarioCorrente = user;
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        return true;
    }
    return false;
}

// Função de Logout
function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    window.location.href = LOGIN_URL;
}

// Função de Cadastro
function addUser(nome, login, senha, email) {
    // Cria o objeto com o campo 'login' incluído
    const novoUsuario = { 
        nome: nome, 
        login: login, // Adicionado
        senha: senha, 
        email: email,
        tipoUsuario: "usuario", // Padrão
        profissao: "",
        localizacao: "",
        biografia: "",
        interesses: [],
        fotoUrl: ""
    };

    // 🚨 CORRETO: fetch com API_URL + COLLECTION_NAME para POST
    fetch(`${techeduvercel.vercel.app}${COLLECTION_NAME}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
    })
    .then(response => response.json())
    .then(() => {
        alert("Cadastro realizado com sucesso! Faça login.");
        window.location.href = LOGIN_URL;
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro ao cadastrar. Verifique sua conexão com a API.");
    });
}

// Mostra informações no Dashboard
function showUserInfo() {
    // Procura elementos na tela para preencher
    const nomeElements = document.querySelectorAll('.user-name'); 
    const avatarElements = document.querySelectorAll('.avatar-gradient');
    
    if (usuarioCorrente.nome) {
        nomeElements.forEach(el => el.textContent = usuarioCorrente.nome);
        // Pega as iniciais do nome para o avatar
        const iniciais = usuarioCorrente.nome.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        avatarElements.forEach(el => el.textContent = iniciais);
    }
}

// --- LÓGICA DE EVENTOS (O "COLA" ENTRE HTML E JS) ---
document.addEventListener('DOMContentLoaded', () => {
    initLoginApp();

    // 1. Lógica do Formulário de LOGIN
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            // Permite login por email ou login
            const credential = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            // O login só funcionará se carregarUsuarios funcionar, que agora está corrigido.
            if (loginUser(credential, pass)) {
                window.location.href = RETURN_URL;
            } else {
                alert('Usuário ou senha incorretos!');
            }
        });
    }

    // 2. Lógica do Formulário de CADASTRO (Na Home)
    const formCadastro = document.getElementById('form-cadastro');
    
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => { 
            e.preventDefault();
            
            // Pegando os valores
            const login = document.getElementById('reg-login').value.trim(); 
            const nome = document.getElementById('reg-nome').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const senha = document.getElementById('reg-senha').value.trim();

            if (!login || !nome || !email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            try {
                // --- PASSO IMPORTANTE: VERIFICAÇÃO DE DUPLICIDADE ---
                // 🚨 CORRETO: Usando a variável COLLECTION_NAME
                const response = await fetch(`${techeduvercel.vercel.app}${COLLECTION_NAME}?login=${login}`);
                const existingUsers = await response.json();

                if (existingUsers.length > 0) {
                    // Se a lista voltou com algum item, o usuário já existe
                    alert(`O usuário "${login}" já está em uso. Escolha outro.`);
                    return; // Para tudo e não cadastra
                }

                // Se chegou aqui, o usuário está livre. Pode cadastrar!
                addUser(nome, login, senha, email);

            } catch (error) {
                console.error("Erro ao verificar usuário:", error);
                alert("Erro de conexão ao verificar disponibilidade do usuário.");
            }
        });
    }
    
    // 3. Botão de Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
