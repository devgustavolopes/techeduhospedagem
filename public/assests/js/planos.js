const API_URL = 'https://tech-edu-api-json.onrender.com';
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificação de Login
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userJson);

    // 2. Setup do Header
    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl) avatarEl.innerText = currentUser.nome.charAt(0);

    // 3. Carregamento dos Planos
    await loadUserPlans();
});

/**
 * Busca e renderiza os planos do usuário logado no JSON Server.
 */
async function loadUserPlans() {
    const container = document.getElementById('plans-list');

    // Garantindo que o container pai esteja com as cores de debug
    container.style.opacity = '1';
    container.style.minHeight = '200px';
    container.style.padding = '20px';

    container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-white">Carregando planos...</p></div>`;

    try {
        // 🚨 CORREÇÃO: Usando a URL completa com o filtro de usuário
        const fetchUrl = `${API_URL}/planos?userId=${currentUser.id}`; 
        
        // 🚨 CORREÇÃO APLICADA AQUI
        const res = await fetch(fetchUrl); 
        const plans = await res.json();

        if (!res.ok) {
            throw new Error(`Falha no servidor: ${res.status}`);
        }

        container.innerHTML = ''; // Limpa o carregamento

        if (plans.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="ph-duotone ph-notebook" style="font-size: 4rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <p>Você ainda não criou nenhum plano de estudos.</p>
                </div>`;
            return;
        }

        plans.forEach(plan => {
            const progress = calculateProgress(plan);

            // Define cores dinamicamente
            let badgeColor = 'var(--primary)';
            if (plan.category === 'hardware') badgeColor = '#00f2ff';
            if (plan.category === 'software') badgeColor = '#00ff88';

            // --- INJEÇÃO DO CARD COM ESTILO FORÇADO ---
            const card = document.createElement('div');
            card.className = 'col-md-6';
            card.innerHTML = `
    <div class="post-card h-100 d-flex flex-column" 
          data-aos="fade-up" 
          onclick="openPlan('${plan.id}')" 
          style="cursor: pointer; border-color: ${badgeColor}; /* Destaque na borda */">
        
        <div class="d-flex justify-content-between align-items-start mb-3">
            <span class="badge-topic" style="color: ${badgeColor}; border-color: ${badgeColor}; background: rgba(0,0,0,0.3);">
                ${plan.category.toUpperCase()}
            </span>
            <button class="btn btn-sm" style="color: #ff4444;" onclick="event.stopPropagation(); deletePlan('${plan.id}');">
                <i class="ph-bold ph-trash"></i>
            </button>
        </div>
        
        <h4 class="text-white mb-2">${plan.title}</h4>
        
        <p class="form-label small mb-4" style="color: var(--text-gray); font-size: 0.9rem; max-height: 40px; overflow: hidden;">
            ${plan.description}
        </p>
        
        <div class="mb-3 mt-auto">
            <div class="d-flex justify-content-between text-white small mb-1">
                <span>Progresso</span>
                <span>${progress}%</span>
            </div>
            <div class="progress" style="height: 6px; background: rgba(255,255,255,0.1);">
                <div class="progress-bar" style="width: ${progress}%; background: ${badgeColor};"></div>
            </div>
        </div>

        <button class="btn-primary w-100" style="
            border: 1px solid ${badgeColor}; 
            color: white; 
            background: transparent;
            /* Usando a cor do badge para hover sutil */
        ">
            Continuar
        </button>
    </div>
`;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar planos:', error);
        container.innerHTML = '<p class="text-danger text-center py-5">Não foi possível carregar os planos. Verifique sua conexão e se o JSON Server está rodando na porta 3001.</p>';
    }
}

/**
 * Calcula a porcentagem de progresso de um plano.
 */
function calculateProgress(plan) {
    // Requer 'studyDatabase' do arquivo database.js
    if (!plan.topics || typeof studyDatabase === 'undefined') return 0; 

    let total = 0;
    let completed = 0;

    plan.topics.forEach(topic => {
        const content = studyDatabase[plan.category]?.[topic.value];
        if (content) {
            total += content.tasks.length;
            completed += topic.completedTasks.length;
        }
    });

    return total === 0 ? 0 : Math.round((completed / total) * 100);
}

// --- Funções Globais ---

window.deletePlan = async (id) => {
    if (confirm("Deseja realmente excluir este plano?")) {
        try {
            // URL Correta para DELETE
            const res = await fetch(`${API_URL}/planos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao deletar.');
            loadUserPlans(); // Recarrega a lista
        } catch (error) {
            alert('Erro ao deletar o plano. Tente novamente.');
        }
    }
};

window.openPlan = (id) => {
    sessionStorage.setItem('currentPlanId', id);
    window.location.href = 'detalhe-plano.html';
};