// Arquivo: assets/js/script-login.js (Ou onde ele estiver)

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// --- CONFIGURAÇÕES --
const LOGIN_URL = "login.html";
const HOME_URL = "index.html"; 
let RETURN_URL = "dashboard.html"; 

// Objeto para o banco de dados (ainda usados para armazenar em memória)
var db_usuarios = {};
var usuarioCorrente = {};

// Inicializa a aplicação
function initLoginApp() {
    carregarUsuarios(() => {
        console.log('Banco de dados de usuários carregado do Supabase.');
    });

    const path = window.location.pathname;
    const isRestricted = path.includes('dashboard.html');

    if (isRestricted) {
        const usuarioJSON = sessionStorage.getItem('usuarioCorrente');
        
        if (usuarioJSON) {
            usuarioCorrente = JSON.parse(usuarioJSON);
            showUserInfo();
        } else {
            window.location.href = LOGIN_URL;
        }
    }
}

// Carrega usuários da API (GET) - AGORA DO SUPABASE
async function carregarUsuarios(callback) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');

    if (error) {
        console.error('Erro ao carregar usuários do Supabase:', error);
        alert('Erro de conexão com o banco de dados. Verifique o console.');
        return;
    }
    
    db_usuarios = data;
    if (callback) callback();
}

// Função de Login (Lógica local, busca no array db_usuarios)
function loginUser(login, senha) {
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

// Função de Cadastro (POST) - AGORA USANDO SUPABASE
async function addUser(nome, login, senha, email) {
    const novoUsuario = {
        nome: nome,
        login: login,
        email: email,
        senha: senha,
        tipoUsuario: 'estudante',
        createdAt: new Date().toISOString()
    };
    
    const { data: createdUser, error } = await supabase
        .from('usuarios')
        .insert([novoUsuario])
        .select(); 

    if (error) {
        console.error('Erro Supabase ao cadastrar:', error);
        alert(`❌ Falha ao cadastrar: ${error.message}. Verifique a política RLS (INSERT) da tabela 'usuarios'.`);
        return;
    }

    if (createdUser && createdUser.length > 0) {
        usuarioCorrente = createdUser[0];
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        alert('✅ Cadastro realizado com sucesso! Bem-vindo(a)!');
        window.location.href = RETURN_URL;
    }
}

// --- FUNÇÕES DE SETUP DA PÁGINA ---

function showUserInfo() {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.innerText = `Olá, ${usuarioCorrente.nome.split(' ')[0]}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initLoginApp();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('log-login').value.trim();
            const senha = document.getElementById('log-senha').value.trim();
            
            if (loginUser(login, senha)) {
                window.location.href = RETURN_URL;
            } else {
                alert('Login ou senha incorretos. Tente novamente.');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => { 
            e.preventDefault();
            
            const login = document.getElementById('reg-login').value.trim();
            const nome = document.getElementById('reg-nome').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const senha = document.getElementById('reg-senha').value.trim();

            if (!login || !nome || !email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            try {
                // --- VERIFICAÇÃO DE DUPLICIDADE (Supabase) ---
                const { data: existingUsers, error: checkError } = await supabase
                    .from('usuarios')
                    .select('login')
                    .eq('login', login); // Verifica se o login já existe

                if (checkError) throw new Error(checkError.message);

                if (existingUsers.length > 0) {
                    alert(`O usuário "${login}" já está em uso. Escolha outro.`);
                    return;
                }

                await addUser(nome, login, senha, email); 

            } catch (error) {
                console.error("Erro ao verificar usuário:", error);
                alert(`Erro de conexão ao verificar disponibilidade do usuário: ${error.message}`);
            }
        });
    }
    
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});