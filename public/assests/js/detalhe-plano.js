// CORREÇÃO ESSENCIAL: Adicione o protocolo para que o navegador a reconheça como uma URL válida.
const API_URL = 'https://techeduvercel.vercel.app';
// O uso no 'fetch' já está correto: fetch(`${API_URL}/posts`)
let currentPlan = null; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificação de Pré-requisitos
    const userJson = sessionStorage.getItem('usuarioCorrente');
    const planId = sessionStorage.getItem('currentPlanId');

    if (!userJson || !planId) { 
        window.location.href = 'planos.html'; 
        return; 
    }

    const user = JSON.parse(userJson);
    document.getElementById('header-avatar').innerText = user.nome.charAt(0);

    // 2. Carregar e Renderizar
    await loadPlanDetails(planId);
});

/**
 * Carrega o plano do usuário do JSON Server.
 */
async function loadPlanDetails(id) {
    try {
        const res = await fetch(`${'techeduvercel.vercel.app'}/planos/${id}`);
        if (!res.ok) throw new Error('Plano não encontrado.');
        
        currentPlan = await res.json();
        
        // Proteção extra: verifica se o plano pertence ao usuário logado
        const user = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
        if (currentPlan.userId !== user.id) {
            alert("Acesso negado a este plano.");
            window.location.href = 'planos.html';
            return;
        }

        document.getElementById('plan-title').innerText = currentPlan.title;
        document.getElementById('plan-desc').innerText = currentPlan.description;
        
        // Renderiza tudo
        renderModules();
        updateProgressBar();

    } catch (error) {
        console.error('Erro ao carregar plano:', error);
        alert("Erro ao carregar detalhes do plano. Verifique se o JSON Server está ativo.");
        window.location.href = 'planos.html';
    }
}

/**
 * Renderiza os accordions de tópicos e suas tarefas internas.
 */
function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = '';

    currentPlan.topics.forEach(topic => {
        // Pega o conteúdo estático (tarefas e recursos)
        const content = studyDatabase[currentPlan.category]?.[topic.value];
        if (!content) return;

        const totalTasks = content.tasks.length;
        const completedCount = topic.completedTasks.length;
        const isComplete = totalTasks > 0 && completedCount === totalTasks;

        // HTML das tarefas (Tasks estáticas)
        const tasksHtml = content.tasks.map((taskText, index) => {
            const isChecked = topic.completedTasks.includes(index);
            const taskClass = isChecked ? 'text-gray-500' : 'text-white';
            
            return `
                <div class="d-flex gap-3 align-items-start mb-3 p-2 rounded task-item">
                    <input class="form-check-input mt-1" type="checkbox" 
                           ${isChecked ? 'checked' : ''} 
                           onchange="toggleTask('${topic.value}', ${index})"
                           style="border-color: #555; background-color: ${isChecked ? '#00ff88' : 'rgba(255,255,255,0.1)'};">
                    <label class="${taskClass}" style="${isChecked ? 'text-decoration: line-through;' : ''}">
                        ${taskText}
                    </label>
                </div>
            `;
        }).join('');

        // Recursos Sugeridos
         const resourcesHtml = content.resources.map(res => `
            <p><a href="${res.url}" target="_blank" class="text-info"><i class="ph-bold ph-link"></i> ${res.title}</a></p>
        `).join('');

        // Card do Módulo
        const moduleHtml = `
            <details class="form-wrapper p-0 mb-3" ${isComplete ? '' : 'open'} style="border-left: 4px solid ${isComplete ? '#00ff88' : 'var(--primary)'};">
                <summary class="p-3 d-flex justify-content-between align-items-center" style="cursor: pointer; list-style: none;">
                    <strong class="text-white h5 mb-0">${topic.text}</strong>
                    <span class="badge ${isComplete ? 'bg-success' : 'bg-secondary'}">${completedCount}/${totalTasks}</span>
                </summary>
                <div class="p-3 border-top border-secondary">
                    <h5 class="text-white mb-3">Tarefas:</h5>
                    ${tasksHtml}
                    ${content.resources.length ? '<h5 class="text-white mt-4 mb-2">Recursos Sugeridos:</h5>' : ''}
                    ${resourcesHtml}
                </div>
            </details>
        `;
        container.innerHTML += moduleHtml;
    });
}

/**
 * Marca/desmarca a tarefa e salva o novo estado no JSON Server usando PATCH.
 */
window.toggleTask = async (topicValue, taskIndex) => {
    const topic = currentPlan.topics.find(t => t.value === topicValue);
    if (!topic) return;

    // 1. Atualiza o estado localmente
    if (topic.completedTasks.includes(taskIndex)) {
        // Desmarcar: remove o índice
        topic.completedTasks = topic.completedTasks.filter(i => i !== taskIndex);
    } else {
        // Marcar: adiciona o índice
        topic.completedTasks.push(taskIndex);
    }

    try {
        // 2. Salva o array de tópicos ATUALIZADO no servidor
        const res = await fetch(`${'techeduvercel.vercel.app'}/planos/${currentPlan.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topics: currentPlan.topics }) // Envia apenas o campo 'topics'
        });
        
        if (!res.ok) throw new Error('Falha ao salvar progresso.');

        // 3. Re-renderiza a UI para refletir a mudança
        renderModules(); 
        updateProgressBar();
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        alert('Seu progresso não foi salvo. Verifique a porta 3000 do JSON Server.');
    }
};

/**
 * Atualiza a barra de progresso principal.
 */
function updateProgressBar() {
    let total = 0;
    let completed = 0;

    currentPlan.topics.forEach(topic => {
        const content = studyDatabase[currentPlan.category]?.[topic.value];
        if (content) {
            total += content.tasks.length;
            completed += topic.completedTasks.length;
        }
    });

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    const fill = document.getElementById('main-progress-bar');
    const text = document.getElementById('progress-text');
    
    if (fill) {
        fill.style.width = `${percent}%`;
        fill.setAttribute('aria-valuenow', percent);
    }
    if (text) text.innerText = `${completed} de ${total} tarefas concluídas (${percent}%)`;
}
