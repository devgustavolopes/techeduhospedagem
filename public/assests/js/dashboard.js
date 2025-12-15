// Arquivo: dashboard.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app'; 
let currentUser = null;
let replyModalObj = null; 

// Requer a variável global studyDatabase do database.js
// @ts-ignore
const studyDatabase = window.studyDatabase; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. VERIFICAÇÃO DE SEGURANÇA
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(userJson);
    
    // Se não for admin, redireciona (ou limita a visualização)
    if (currentUser.tipoUsuario !== 'admin') {
        // Redireciona usuários normais para outra view ou esconde o menu Admin
        // Por enquanto, apenas esconde o link 'Admin' se ele existir.
        const adminLink = document.getElementById('sidebar-admin-link');
        if (adminLink) adminLink.style.display = 'none';
    }

    // 2. INICIALIZAÇÃO DO MODAL DE RESPOSTA (Se necessário para uso futuro)
    const modalEl = document.getElementById('replyModal');
    if (modalEl) {
        // @ts-ignore
        replyModalObj = new bootstrap.Modal(modalEl);
    }

    // 3. CARREGAMENTO INICIAL
    setupSidebar();
    loadView('home'); 
    setupNavigation();
    setupReplyForm(); 
});

// --- FUNÇÕES DE SETUP (Inalteradas) ---
function setupSidebar() {
    document.getElementById('sidebar-name').innerText = currentUser.nome;
    document.getElementById('header-name').innerText = currentUser.nome.split(' ')[0];
    
    const roleLabel = currentUser.tipoUsuario === 'admin' ? 'Administrador' : 'Estudante';
    document.getElementById('sidebar-role').innerText = roleLabel;
    
    document.getElementById('sidebar-avatar').innerText = currentUser.nome.charAt(0);
}

function setupNavigation() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const viewName = this.getAttribute('data-view');
            if (viewName) {
                loadView(viewName);
            }
        });
    });
}

function loadView(view) {
    document.querySelectorAll('.dashboard-view').forEach(v => {
        // @ts-ignore
        v.style.display = v.id === `${view}-view` ? 'block' : 'none';
    });
    
    // Renderiza o conteúdo da view
    const viewContainer = document.getElementById(`${view}-view`);
    if (viewContainer) {
        switch (view) {
            case 'admin':
                viewContainer.innerHTML = renderAdminView();
                break;
            case 'planos':
                viewContainer.innerHTML = renderPlanosView();
                break;
            case 'home':
                viewContainer.innerHTML = renderHomeView();
                break;
            // ... outros casos
        }
    }
}

// --- VISUALIZAÇÕES DAS VIEWS (GET) ---

function renderHomeView() {
    // Conteúdo da Home View (Estática ou com dados do usuário)
    return `
        <div class="glass-bg p-4 rounded shadow-lg text-white">
            <h2 class="text-primary mb-3">Bem-vindo(a), ${currentUser.nome.split(' ')[0]}!</h2>
            <p>Este é o seu painel. Use a barra lateral para navegar.</p>
            ${currentUser.tipoUsuario === 'admin' ? 
                '<p class="text-warning">Você tem acesso de Administrador. Use com responsabilidade.</p>' : 
                '<p>Você está logado como estudante.</p>'
            }
            </div>
    `;
}

function renderPlanosView() {
    // Simples link para a página de planos reais
     return `
        <div class="glass-bg p-4 rounded shadow-lg text-white">
            <h2 class="text-primary mb-3">Meus Planos de Estudo</h2>
            <p>Clique <a href="planos.html" class="text-info">aqui</a> para gerenciar seus planos de estudo.</p>
        </div>
    `;
}

// Carrega a view de Administração (Usuários) - GET no Supabase
async function renderAdminView() {
    if (currentUser.tipoUsuario !== 'admin') {
        return '<h3 class="text-danger">Acesso Negado.</h3>';
    }

    const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('id', { ascending: true });
    
    if (error) {
        console.error('Erro Supabase ao carregar usuários:', error);
        return '<h3 class="text-danger">Erro ao carregar usuários de administração.</h3>';
    }

    try {
        let rows = '';
        usuarios.forEach(user => {
            const deleteBtn = user.id !== currentUser.id 
                ? `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')">Excluir</button>`
                : `<button class="btn btn-sm btn-outline-secondary" disabled>Você</button>`;

            rows += `
                <tr class="text-white">
                    <td style="padding: 15px; border-bottom: 1px solid var(--glass-border);">${user.nome}</td>
                    <td style="padding: 15px; border-bottom: 1px solid var(--glass-border);">${user.login}</td>
                    <td style="padding: 15px; border-bottom: 1px solid var(--glass-border);">${user.tipoUsuario}</td>
                    <td style="padding: 15px; border-bottom: 1px solid var(--glass-border);">${deleteBtn}</td>
                </tr>
            `;
        });
        
        // Retorna a estrutura HTML com a lista de usuários
        return `
            <div class="glass-bg p-4 rounded shadow-lg">
                <h2 class="text-primary mb-4">Gerenciamento de Usuários</h2>
                <div class="table-responsive">
                    <table style="width: 100%; text-align: left; border-collapse: collapse;">
                        <thead style="color: var(--primary); border-bottom: 2px solid var(--glass-border);">
                            <tr>
                                <th style="padding: 15px;">Nome</th>
                                <th style="padding: 15px;">Login</th>
                                <th style="padding: 15px;">Tipo</th>
                                <th style="padding: 15px;">Ações</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        return '<h3 class="text-white">Erro ao carregar usuários.</h3>';
    }
}

// Função Global para deletar (Admin) - DELETE no Supabase
window.deleteUser = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            // 🚨 CORREÇÃO DELETE: Usando Supabase para deletar
            const { error } = await supabase
                .from('usuarios')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);

            alert('Usuário excluído com sucesso.');
            loadView('admin'); // Recarrega a view de administração
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert(`❌ Erro ao excluir usuário. Verifique a política RLS (DELETE). Detalhe: ${error.message}`);
        }
    }
};

// Funções do Modal de Mensagens (Mantidas vazias pois a lógica está em admin-contato.js)
function setupReplyForm() { /* ... */ }
window.openReply = (id, email, originalMsg) => { /* ... */ };