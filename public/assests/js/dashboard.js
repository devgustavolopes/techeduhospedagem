const API_URL = 'techeduvercel.vercel.app'; // URL Base do JSON Server
let currentUser = null;
let replyModalObj = null; // Para controlar o Modal do Bootstrap

document.addEventListener('DOMContentLoaded', async () => {
    // 1. VERIFICAÇÃO DE SEGURANÇA
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(userJson);

    // 2. INICIALIZAÇÃO DO MODAL DE RESPOSTA
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

// --- CONFIGURAÇÃO DA SIDEBAR ---
function setupSidebar() {
    document.getElementById('sidebar-name').innerText = currentUser.nome;
    document.getElementById('header-name').innerText = currentUser.nome.split(' ')[0];
    
    const roleLabel = currentUser.tipoUsuario === 'admin' ? 'Administrador' : 'Estudante';
    document.getElementById('sidebar-role').innerText = roleLabel;
    
    document.getElementById('sidebar-avatar').innerText = currentUser.nome.charAt(0);

    // Se for Admin, mostra os menus ocultos
    if (currentUser.tipoUsuario === 'admin') {
        const adminMenu = document.getElementById('menu-admin');
        const msgMenu = document.getElementById('menu-mensagens');
        if (adminMenu) adminMenu.style.display = 'flex';
        if (msgMenu) msgMenu.style.display = 'flex';
    }

    // Configura o botão de Logout
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('usuarioCorrente');
        window.location.href = 'index.html';
    });
}

// --- NAVEGAÇÃO DO MENU ---
function setupNavigation() {
    const links = document.querySelectorAll('.menu-item[data-view]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.menu-item').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const view = link.getAttribute('data-view');
            loadView(view);
        });
    });
}

// --- ROTEADOR DE CONTEÚDO ---
async function loadView(viewName) {
    const container = document.getElementById('dynamic-content');
    
    container.innerHTML = `
        <div class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>`;

    if (viewName === 'home') {
        container.innerHTML = getHomeHTML();
        if(window.AOS) window.AOS.refresh(); 
    } 
    else if (viewName === 'profile') {
        container.innerHTML = getProfileHTML();
        setupProfileForm(); 
    } 
    else if (viewName === 'admin') {
        if (currentUser.tipoUsuario !== 'admin') return loadView('home');
        container.innerHTML = await getAdminUsersHTML();
    }
}

// ====================================================================
// 1. TELA HOME (DASHBOARD)
// ====================================================================
function getHomeHTML() {
    return `
        <section class="dashboard-hero" data-aos="fade-up">
            <div class="dash-hero-content">
                <span class="badge-continue">RESUMO</span>
                <h3>Olá, ${currentUser.nome.split(' ')[0]}!</h3>
                <p style="color: #ccc; margin-bottom: 1rem;">O que vamos aprender hoje?</p>
                
                <button class="btn-primary" onclick="window.location.href='planos.html'" style="padding: 10px 25px; margin-top: 10px;">
                    <i class="ph-bold ph-rocket-launch"></i> Continuar Estudando
                </button>
            </div>
        </section>
        
        <h3 class="text-white mb-3">Acesso Rápido</h3>
        <div class="courses-grid">
            
            <div class="course-card" onclick="window.location.href='planos.html'" style="cursor: pointer; border-color: var(--secondary);">
                <div class="card-header-course">
                    <div class="card-icon" style="color: var(--secondary); background: rgba(0, 242, 255, 0.1);">
                        <i class="ph-bold ph-graduation-cap"></i>
                    </div>
                </div>
                <div>
                    <h4 style="color: var(--secondary);">Meus Planos</h4>
                    <small>Gerenciar trilhas e progresso</small>
                </div>
                <button class="btn-start">Acessar</button>
            </div>

            <div class="course-card" onclick="window.location.href='comunidade.html'" style="cursor: pointer;">
                <div class="card-header-course"><div class="card-icon"><i class="ph-bold ph-users-three"></i></div></div>
                <div><h4>Comunidade</h4><small>Fórum e discussões</small></div>
                <button class="btn-start">Entrar</button>
            </div>

            <div class="course-card" onclick="loadView('profile')" style="cursor: pointer;">
                <div class="card-header-course"><div class="card-icon"><i class="ph-bold ph-user"></i></div></div>
                <div><h4>Meu Perfil</h4><small>Ver e editar dados</small></div>
                <button class="btn-start">Acessar</button>
            </div>

            ${currentUser.tipoUsuario === 'admin' ? `
            <div class="course-card" onclick="loadView('admin')" style="cursor: pointer;">
                <div class="card-header-course"><div class="card-icon"><i class="ph-bold ph-users"></i></div></div>
                <div><h4>Gestão</h4><small>Administrar usuários</small></div>
                <button class="btn-start">Acessar</button>
            </div>
            
            <div class="course-card" onclick="window.location.href='admin-contato.html'" style="cursor: pointer;">
                <div class="card-header-course"><div class="card-icon"><i class="ph-bold ph-envelope"></i></div></div>
                <div><h4>Mensagens</h4><small>Ir para painel de mensagens</small></div>
                <button class="btn-start">Acessar</button>
            </div>
            ` : ''}
        </div>
    `;
}

// ====================================================================
// 2. TELA DE PERFIL (CORRIGIDA: BIOGRAFIA EMBAIXO)
// ====================================================================
function getProfileHTML() {
    return `
        <div class="form-wrapper p-4" style="background: var(--bg-secondary); border-radius: 16px; border: 1px solid var(--glass-border);">
            <h3 class="text-white mb-4">Editar Meus Dados</h3>
            
            <form id="form-perfil" class="tech-form">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label text-gray d-block">Nome Completo</label>
                        <input type="text" id="edit-nome" class="form-control" value="${currentUser.nome}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-gray d-block">Email</label>
                        <input type="email" id="edit-email" class="form-control" value="${currentUser.email}">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label text-gray d-block">Profissão</label>
                        <input type="text" id="edit-profissao" class="form-control" value="${currentUser.profissao || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-gray d-block">Localização</label>
                        <input type="text" id="edit-local" class="form-control" value="${currentUser.localizacao || ''}">
                    </div>

                    <div class="col-12">
                        <label class="form-label text-gray d-block" style="margin-bottom: 8px;">Biografia</label>
                        <textarea id="edit-bio" class="form-control" rows="4" style="width: 100%; min-height: 100px;">${currentUser.biografia || ''}</textarea>
                    </div>

                    <div class="col-12 text-end mt-4">
                        <button type="submit" class="btn-primary small">Salvar Alterações</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function setupProfileForm() {
    document.getElementById('form-perfil').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        currentUser.nome = document.getElementById('edit-nome').value;
        currentUser.email = document.getElementById('edit-email').value;
        currentUser.profissao = document.getElementById('edit-profissao').value;
        currentUser.localizacao = document.getElementById('edit-local').value;
        currentUser.biografia = document.getElementById('edit-bio').value;

        try {
            await fetch(`${'https://tech-edu-api-json.onrender.com'}/usuarios/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUser)
            });
            
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(currentUser));
            setupSidebar(); 
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar alterações.');
        }
    });
}

// ====================================================================
// 3. TELA DE ADMIN - USUÁRIOS (CORRIGIDA: BOTÃO COM CSS)
// ====================================================================
// --- TELA DE ADMIN (USUÁRIOS) - COM BOTÃO BONITO ---
async function getAdminUsersHTML() {
    try {
        const res = await fetch(`${'https://tech-edu-api-json.onrender.com'}/usuarios`);
        const users = await res.json();

        const rows = users.map(user => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 15px; color: white; vertical-align: middle;">
                    <div style="font-weight: 600;">${user.nome}</div>
                </td>
                <td style="padding: 15px; color: #aaa; vertical-align: middle;">@${user.login}</td>
                <td style="padding: 15px; vertical-align: middle;">
                    <span class="badge ${user.tipoUsuario === 'admin' ? 'bg-danger' : 'bg-primary'}" 
                          style="padding: 8px 12px; border-radius: 6px;">
                        ${user.tipoUsuario}
                    </span>
                </td>
                <td style="padding: 15px; vertical-align: middle;">
                    ${user.id !== currentUser.id ? 
                    /* AQUI ESTÁ O NOVO BOTÃO COM A CLASSE NEON */
                    `<button onclick="deleteUser('${user.id}')" class="btn-danger-neon">
                        <i class="ph-bold ph-trash"></i> Excluir
                     </button>` 
                    : '<span style="color: var(--primary); font-weight: bold; font-size: 0.9rem;">(Você)</span>'}
                </td>
            </tr>
        `).join('');

        return `
            <div class="form-wrapper p-4" style="background: var(--bg-secondary); border-radius: 16px; border: 1px solid var(--glass-border);">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="text-white mb-0">Gerenciar Usuários</h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 20px; color: white; font-size: 0.9rem;">
                        Total: <strong>${users.length}</strong>
                    </div>
                </div>
                
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

// Função Global para deletar (Admin)
window.deleteUser = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            await fetch(`${'https://tech-edu-api-json.onrender.com'}/usuarios/${id}`, { method: 'DELETE' });
            loadView('admin'); 
        } catch (error) {
            alert('Erro ao excluir usuário.');
        }
    }
};

// Funções do Modal de Mensagens (Caso precise no futuro, já estão aqui)
window.openReply = (id, email, originalMsg) => { /* ... lógica mantida se necessário ... */ };
function setupReplyForm() { /* ... lógica mantida ... */ }
