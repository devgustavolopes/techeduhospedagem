// Arquivo: comunidade.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app';
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica Login
    const userJson = sessionStorage.getItem('usuarioCorrente');
    if (!userJson) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userJson);

    // 2. Configura Header
    document.getElementById('header-avatar').innerText = currentUser.nome.charAt(0);
    document.getElementById('user-display').innerText = `Postando como: @${currentUser.login}`;

    // 3. Carrega Posts
    loadPosts();

    // 4. Configura Formulário de Postar
    const form = document.getElementById('form-novo-post');
    form.addEventListener('submit', handleNewPost);
});

// --- CARREGAR POSTS (GET) - AGORA USANDO SUPABASE --
async function loadPosts() {
    const container = document.getElementById('feed-container');
    
    try {
        // 🚨 CORREÇÃO GET: Busca posts do Supabase
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('createdAt', { ascending: false }); // Ordena por data de criação

        if (error) throw new Error(error.message);
        
        if(posts.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-white">Nenhum post ainda. Seja o primeiro a criar!</p></div>`;
            return;
        }

        let html = '';
        posts.forEach(post => {
            // Assume que 'isLiked' e 'comments' estão no seu modelo de dados
            const isLiked = post.isLiked || false; 
            const likeIcon = isLiked ? 'bi-heart-fill text-danger' : 'bi-heart';
            const commentsCount = post.comments ? post.comments.length : 0;
            const commentsHtml = renderComments(post.comments || []);

            html += `
                <div class="card post-card glass-bg mb-4">
                    <div class="card-header bg-dark-glass d-flex justify-content-between align-items-center">
                        <span class="text-primary fw-bold">${post.user}</span>
                        <span class="text-light-gray small">${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text text-white">${post.content}</p>
                    </div>
                    <div class="card-footer bg-dark-glass">
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-sm btn-action" onclick="toggleLike('${post.id}', ${post.likes || 0}, ${isLiked})">
                                <i class="bi ${likeIcon}"></i> ${post.likes || 0} Likes
                            </button>
                            <button class="btn btn-sm btn-action" type="button" data-bs-toggle="collapse" data-bs-target="#comments-${post.id}" aria-expanded="false" aria-controls="comments-${post.id}">
                                <i class="bi bi-chat-text"></i> ${commentsCount} Comentários
                            </button>
                        </div>
                        
                        <div class="collapse mt-3" id="comments-${post.id}">
                            ${commentsHtml}
                            <form onsubmit="submitComment(event, '${post.id}')" class="mt-3">
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm bg-dark-glass text-white border-0" placeholder="Seu comentário...">
                                    <button class="btn btn-primary btn-sm" type="submit">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        container.innerHTML = '<p class="text-danger text-center py-5">Erro ao carregar o feed. Verifique sua conexão e a política RLS (SELECT).</p>';
    }
}

function renderComments(comments) {
    if (comments.length === 0) return '<p class="small text-light-gray">Nenhum comentário ainda.</p>';
    
    let html = '<ul class="list-unstyled small">';
    comments.forEach(c => {
        html += `<li><span class="fw-bold text-info">${c.user}:</span> <span class="text-light-gray">${c.text}</span></li>`;
    });
    html += '</ul>';
    return html;
}

// --- NOVO POST (POST) - AGORA USANDO SUPABASE --
async function handleNewPost(e) {
    e.preventDefault();
    const content = document.getElementById('post-content').value.trim();
    if (!content) return;

    const newPost = {
        user: "@" + currentUser.login,
        userId: currentUser.id,
        content: content,
        likes: 0,
        isLiked: false, // Inicia como não curtido
        comments: [],
        createdAt: new Date().toISOString()
    };
    
    try {
        // 🚨 CORREÇÃO POST: Insere o novo post
        const { error } = await supabase
            .from('posts')
            .insert([newPost]);

        if (error) throw new Error(error.message);

        document.getElementById('post-content').value = '';
        await loadPosts();
        
    } catch (error) {
        console.error('Erro ao postar:', error);
        alert(`❌ Falha ao criar post. Verifique a política RLS (INSERT). Detalhe: ${error.message}`);
    }
}

// --- LIKE (PATCH) - AGORA USANDO SUPABASE --
window.toggleLike = async (id, currentLikes, isLiked) => {
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    
    try {
        // 🚨 CORREÇÃO PATCH: Atualiza likes e isLiked
        const { error } = await supabase
            .from('posts')
            .update({ likes: newLikes, isLiked: !isLiked })
            .eq('id', id);

        if (error) throw new Error(error.message);

        loadPosts();

    } catch (error) {
        console.error('Erro ao curtir/descurtir:', error);
        alert(`❌ Falha ao curtir. Verifique a política RLS (UPDATE). Detalhe: ${error.message}`);
    }
};

// --- COMENTAR (PATCH) - AGORA USANDO SUPABASE --
window.submitComment = async (e, postId) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const text = input.value;
    if (!text) return;

    try {
        // 1. Pega o post atual para não perder comentários antigos
        const { data: postArray, error: fetchError } = await supabase
            .from('posts')
            .select('comments')
            .eq('id', postId)
            .single();

        if (fetchError) throw new Error(`Falha ao buscar post: ${fetchError.message}`);
        const post = postArray;

        const newComment = {
            user: "@" + currentUser.login,
            text: text
        };

        const updatedComments = [...(post.comments || []), newComment];

        // 2. Atualiza (PATCH)
        const { error: updateError } = await supabase
            .from('posts')
            .update({ comments: updatedComments })
            .eq('id', postId);

        if (updateError) throw new Error(updateError.message);

        // 3. Recarrega e reabre a aba de comentários
        input.value = '';
        await loadPosts();
        
        // Simula clique para reabrir a seção de comentários
        const commentsToggle = document.querySelector(`[data-bs-target="#comments-${postId}"]`);
        if (commentsToggle) commentsToggle.click();

    } catch (error) {
        console.error('Erro ao comentar:', error);
        alert(`❌ Falha ao comentar. Detalhe: ${error.message}`);
    }
};