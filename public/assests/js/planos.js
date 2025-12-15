// Arquivo: planos.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app';
let currentUser = null;

// Requer a variável global studyDatabase do database.js
// @ts-ignore
const studyDatabase = window.studyDatabase; 

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
 * Busca e renderiza os planos do usuário logado no Supabase (GET com filtro).
 */
async function loadUserPlans() {
    const container = document.getElementById('plans-list');
    container.style.opacity = '1';
    container.style.minHeight = '200px';
    container.style.padding = '20px';

    container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-white">Carregando planos...</p></div>`;

    try {
        // 🚨 CORREÇÃO GET: Usando Supabase para buscar planos do usuário
        const { data: planos, error } = await supabase
            .from('planos')
            .select('*')
            .eq('userId', currentUser.id) // Filtra planos onde userId é igual ao ID do usuário atual
            .order('createdAt', { ascending: false }); // Ordena por data de criação

        if (error) throw new Error(error.message);
        
        if (planos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-white">Você não tem planos de estudo criados.</p>
                    <a href="criar-planos.html" class="btn btn-primary">Começar agora!</a>
                </div>`;
            return;
        }

        // Renderização dos cards
        let html = '';
        planos.forEach(plan => {
            const progress = calculateProgress(plan);
            const levelColor = getLevelColor(plan.level);
            
            html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card plan-card glass-bg">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${plan.title}</h5>
                            <p class="card-text text-light-gray mb-1">${plan.topics.length} tópicos | <span style="color: ${levelColor}">${plan.level}</span></p>
                            
                            <div class="progress my-2" style="height: 8px;">
                                <div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <p class="card-text text-light-gray">${progress}% Concluído</p>
                            
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <button class="btn btn-sm btn-outline-primary" onclick="openPlan('${plan.id}')">Ver Detalhes</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deletePlan('${plan.id}')">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar planos:', error);
        container.innerHTML = '<p class="text-danger text-center py-5">Não foi possível carregar os planos. Verifique a conexão com o Supabase e a política RLS (SELECT).</p>';
    }
}

/**
 * Calcula a porcentagem de progresso de um plano. (Lógica inalterada)
 */
function calculateProgress(plan) {
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

// Funções Auxiliares (mantidas inalteradas)
function getLevelColor(level) {
    switch(level) {
        case 'Iniciante': return '#30a3f9';
        case 'Intermediário': return '#f5c634';
        case 'Avançado': return '#f54242';
        default: return '#ccc';
    }
}

// --- Funções Globais ---

// Redireciona para os detalhes do plano
window.openPlan = (id) => {
    sessionStorage.setItem('currentPlanId', id);
    window.location.href = 'detalhe-plano.html';
};

// Deletar Plano (DELETE) - AGORA USANDO SUPABASE
window.deletePlan = async (id) => {
    if (confirm("Deseja realmente excluir este plano?")) {
        try {
            // 🚨 CORREÇÃO DELETE: Usando Supabase para deletar
            const { error } = await supabase
                .from('planos')
                .delete()
                .eq('id', id); // Deleta o registro com o ID correspondente
            
            if (error) throw new Error(error.message);

            alert('Plano excluído com sucesso.');
            loadUserPlans(); 
        } catch (error) {
            console.error('Erro ao excluir plano:', error);
            alert(`❌ Erro ao excluir plano. Verifique a política RLS (DELETE). Detalhe: ${error.message}`);
        }
    }
};