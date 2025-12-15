// Arquivo: criar-planos.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app'; 
let currentUser = null;

// Requer a variável global studyDatabase do database.js
// @ts-ignore
const studyDatabase = window.studyDatabase; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificação de Login
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) { window.location.href = 'index.html'; return; }
    currentUser = JSON.parse(userJson);
    
    // 2. Setup (Avatar e Tópicos Iniciais)
    document.getElementById('header-avatar').innerText = currentUser.nome.charAt(0);
    renderTopics('hardware'); 

    // 3. Listener para troca de categoria
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', (e) => renderTopics(e.target.value));
    });

    // 4. Submit do Formulário
    document.getElementById('create-plan-form').addEventListener('submit', handleCreatePlan);
});

// ... (renderTopics e updatePreview devem permanecer inalteradas) ...

function renderTopics(category) {
    const container = document.getElementById('topics-container');
    container.innerHTML = '';
    
    if (typeof studyDatabase === 'undefined' || !studyDatabase[category]) {
         container.innerHTML = '<p class="text-danger">Erro: Dados de estudo não carregados.</p>';
         return;
    }

    const topics = studyDatabase[category];
    let html = '';
    for (const key in topics) {
        if (topics.hasOwnProperty(key)) {
            const topic = topics[key];
            // Usa key como value e topic.name ou topic.title (se existir) para o texto
            const topicText = topic.name || topic.title || key; 
            html += `
                <div class="col-md-6">
                    <div class="form-check custom-checkbox">
                        <input class="form-check-input" type="checkbox" name="topics" value="${key}" id="topic-${key}">
                        <label class="form-check-label" for="topic-${key}">${topicText}</label>
                    </div>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}

function updatePreview() {
    const title = document.getElementById('plan-title').value;
    const category = document.querySelector('input[name="category"]:checked')?.value || 'N/A';
    const level = document.querySelector('input[name="level"]:checked')?.value || 'Iniciante';
    const description = document.getElementById('plan-description').value;

    document.getElementById('preview-title').innerText = title || 'Título do Plano';
    document.getElementById('preview-category').innerText = category.toUpperCase();
    document.getElementById('preview-level').innerText = level;
    document.getElementById('preview-description').innerText = description || 'Descrição do seu plano de estudo...';

    const topicsList = document.getElementById('preview-topics');
    topicsList.innerHTML = '';
    
    const selectedTopics = [];
    document.querySelectorAll('input[name="topics"]:checked').forEach(cb => {
        selectedTopics.push(cb.nextElementSibling.innerText);
    });

    if (selectedTopics.length === 0) {
        topicsList.innerHTML = '<li>Nenhum tópico selecionado.</li>';
    } else {
        selectedTopics.forEach(topic => {
            topicsList.innerHTML += `<li>${topic}</li>`;
        });
    }
}

// Lógica de criação (POST) - AGORA USANDO SUPABASE
async function handleCreatePlan(e) {
    e.preventDefault();

    const category = document.querySelector('input[name="category"]:checked')?.value;
    const title = document.getElementById('plan-title').value.trim();
    const level = document.querySelector('input[name="level"]:checked')?.value || 'Iniciante';
    const description = document.getElementById('plan-description').value.trim();

    const selectedTopics = [];
    document.querySelectorAll('input[name="topics"]:checked').forEach(cb => {
        // Assume que o objeto de tópico no plano precisa desta estrutura
        selectedTopics.push({
            value: cb.value,
            text: cb.nextElementSibling.innerText,
            completedTasks: [] 
        });
    });

    if (!category || !title || selectedTopics.length === 0) {
        alert("Preencha o título e selecione pelo menos um tópico.");
        return;
    }

    const newPlan = {
        userId: currentUser.id, // CHAVE CRÍTICA
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
        // 🚨 CORREÇÃO POST: Usando Supabase para inserir novo plano
        const { error } = await supabase
            .from('planos')
            .insert([newPlan]);
        
        if (error) throw new Error(`Falha ao salvar no Supabase: ${error.message}`);

        alert("Plano criado com sucesso!");
        window.location.href = 'planos.html';
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        alert(`❌ Erro ao criar plano. Verifique a política RLS (INSERT). Detalhe: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Criar Plano';
    }
}

// Listeners para a pré-visualização (Preview)
document.addEventListener('input', updatePreview);