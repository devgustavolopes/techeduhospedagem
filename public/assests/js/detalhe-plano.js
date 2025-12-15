// Arquivo: detalhe-plano.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app';
let currentPlan = null; 
// @ts-ignore
const studyDatabase = window.studyDatabase; 

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
 * Carrega o plano do usuário do Supabase (GET por ID).
 */
async function loadPlanDetails(id) {
    try {
        // 🚨 CORREÇÃO GET: Busca por ID no Supabase
        const { data: plan, error } = await supabase
            .from('planos')
            .select('*')
            .eq('id', id)
            .single(); // Espera apenas um resultado

        if (error) throw new Error('Plano não encontrado.');
        
        currentPlan = plan;
        
        // Proteção extra: verifica se o plano pertence ao usuário logado
        const user = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
        if (currentPlan.userId !== user.id) {
            alert("Acesso negado a este plano.");
            window.location.href = 'planos.html';
            return;
        }

        document.getElementById('plan-title').innerText = currentPlan.title;
        document.getElementById('plan-category').innerText = currentPlan.category.toUpperCase();
        document.getElementById('plan-description').innerText = currentPlan.description;

        renderModules(); 
        updateProgressBar();

    } catch (error) {
        console.error('Erro ao carregar detalhes do plano:', error);
        alert('Falha ao carregar detalhes do plano. Verifique o console.');
    }
}

// ... (renderModules e updateProgressBar inalterados) ...

function renderModules() {
    const container = document.getElementById('modules-container');
    container.innerHTML = '';
    
    // Mapeia os tópicos selecionados no plano atual
    currentPlan.topics.forEach(topic => {
        // Pega os detalhes do database.js
        const moduleDetails = studyDatabase[currentPlan.category]?.[topic.value];

        if (!moduleDetails) {
            console.warn(`Módulo ${topic.value} não encontrado no studyDatabase.`);
            return;
        }

        let taskHtml = '';
        let completedCount = 0;

        moduleDetails.tasks.forEach((task, index) => {
            const isCompleted = topic.completedTasks.includes(index);
            if (isCompleted) completedCount++;
            
            const checkedAttr = isCompleted ? 'checked' : '';
            const cardClass = isCompleted ? 'task-completed' : 'task-pending';

            taskHtml += `
                <li class="list-group-item d-flex justify-content-between align-items-center ${cardClass}">
                    ${task}
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${index}" id="task-${topic.value}-${index}" ${checkedAttr}
                            onclick="toggleTaskCompletion('${topic.value}', ${index}, this.checked)">
                    </div>
                </li>
            `;
        });
        
        const totalTasks = moduleDetails.tasks.length;
        const progressPercent = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

        container.innerHTML += `
            <div class="module-card card glass-bg mb-4">
                <div class="card-header bg-dark-glass text-primary">
                    ${moduleDetails.title || topic.text}
                </div>
                <div class="card-body">
                    <p class="card-text text-light-gray">Progresso do Módulo: ${completedCount}/${totalTasks} tarefas (${progressPercent}%)</p>
                    <div class="progress mb-3" style="height: 6px;">
                        <div class="progress-bar" role="progressbar" style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <ul class="list-group list-group-flush task-list">
                        ${taskHtml}
                    </ul>
                    ${moduleDetails.resources && moduleDetails.resources.length > 0 ? `
                        <h6 class="mt-3 text-secondary">Recursos:</h6>
                        <ul class="list-group list-group-flush">
                            ${moduleDetails.resources.map(res => `<li class="list-group-item bg-transparent text-light-gray"><a href="${res.link}" target="_blank">${res.text}</a></li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `;
    });
}

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
    
    if(fill) fill.style.width = `${percent}%`;
    if(text) text.innerText = `${percent}% do Plano concluído`;
}

/**
 * Altera o status da tarefa e salva no Supabase (PATCH).
 */
window.toggleTaskCompletion = async (topicValue, taskId, isCompleted) => {
    // 1. Atualiza o objeto local
    const targetTopic = currentPlan.topics.find(t => t.value === topicValue);
    if (!targetTopic) return;
    
    if (isCompleted) {
        if (!targetTopic.completedTasks.includes(taskId)) {
            targetTopic.completedTasks.push(taskId);
        }
    } else {
        targetTopic.completedTasks = targetTopic.completedTasks.filter(id => id !== taskId);
    }

    try {
        // 2. Salva o novo estado no Supabase
        // 🚨 CORREÇÃO PATCH: Usando Supabase para atualizar
        const { error } = await supabase
            .from('planos')
            .update({ topics: currentPlan.topics }) // Envia apenas o campo 'topics' atualizado
            .eq('id', currentPlan.id);
        
        if (error) throw new Error(`Falha ao salvar progresso no Supabase: ${error.message}`);

        // 3. Re-renderiza a UI para refletir a mudança
        renderModules(); 
        updateProgressBar();
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        alert(`❌ Seu progresso não foi salvo. Verifique a política RLS (UPDATE). Detalhe: ${error.message}`);
    }
};