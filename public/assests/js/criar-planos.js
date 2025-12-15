const API_URL = 'techeduvercel.vercel.app';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificação de Login
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) { window.location.href = 'index.html'; return; }
    currentUser = JSON.parse(userJson);
    
    // 2. Setup (Avatar e Tópicos Iniciais)
    document.getElementById('header-avatar').innerText = currentUser.nome.charAt(0);
    renderTopics('hardware'); // Renderiza o padrão 'hardware'

    // 3. Listener para troca de categoria
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', (e) => renderTopics(e.target.value));
    });

    // 4. Submit do Formulário
    document.getElementById('create-plan-form').addEventListener('submit', handleCreatePlan);
});

/**
 * Renderiza os checkboxes de tópicos baseado na categoria selecionada.
 * Requer que 'studyDatabase' esteja carregado globalmente.
 */
function renderTopics(category) {
    const container = document.getElementById('topics-container');
    container.innerHTML = '';
    
    if (typeof studyDatabase === 'undefined' || !studyDatabase[category]) {
         container.innerHTML = '<p class="text-danger">Erro: Dados de estudo não carregados.</p>';
         return;
    }

    const categoryData = studyDatabase[category];
    
    Object.keys(categoryData).forEach(key => {
        // Formata o nome para exibição
        const labelText = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        const div = document.createElement('div');
        div.className = 'form-check mb-2';
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" name="topics" value="${key}" id="t-${key}">
            <label class="form-check-label text-white" for="t-${key}">
                ${labelText}
            </label>
        `;
        container.appendChild(div);
    });
}

/**
 * Cria o objeto do plano e o envia para o JSON Server.
 */
async function handleCreatePlan(e) {
    e.preventDefault();
    
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const title = document.getElementById('plan-name').value.trim();
    const level = document.getElementById('plan-level').value;
    const description = document.getElementById('plan-desc').value.trim();
    
    const selectedTopics = [];
    document.querySelectorAll('input[name="topics"]:checked').forEach(cb => {
        selectedTopics.push({
            value: cb.value,
            text: cb.nextElementSibling.innerText,
            completedTasks: [] // O progresso SEMPRE começa vazio
        });
    });

    if (!category || !title || selectedTopics.length === 0) {
        alert("Preencha o título e selecione pelo menos um tópico.");
        return;
    }

    const newPlan = {
        userId: currentUser.id, // CHAVE CRÍTICA para a busca
        category,
        title,
        level,
        description,
        topics: selectedTopics,
        createdAt: new Date().toISOString()
    };
    
    const btn = e.submitter;
    btn.disabled = true;
    btn.innerText = 'Salvando...';

    try {
        const res = await fetch(`${'techeduvercel.vercel.app'}/planos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlan)
        });
        
        if (!res.ok) throw new Error('Falha ao salvar no servidor.');

        alert("Plano criado com sucesso!");
        window.location.href = 'planos.html';
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        alert("Erro ao criar plano. Verifique se o JSON Server está rodando na porta 3000 e se não há scripts de segurança interferindo.");
        btn.disabled = false;
        btn.innerText = 'Criar Plano 🚀';
    }
}
