// assets/js/comunidade.js

const API_URL = 'https://tech-edu-api-json.onrender.com';
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

// --- CARREGAR POSTS ---
async function loadPosts() {
    const container = document.getElementById('feed-container');
    
    try {
        const res = await fetch(`${'https://tech-edu-api-json.onrender.com'}/posts`);
        const posts = await res.json();
        
        // Ordena por ID decrescente (simula mais recente primeiro)
        posts.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        if(posts.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Seja o primeiro a postar!</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="post-card" data-aos="fade-up">
                <div class="d-flex gap-3 mb-3">
                    <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #333, #555); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight:bold; font-size: 1.2rem;">
                        ${post.user.username.charAt(1)}
                    </div>
                    <div>
                        <h5 class="text-white mb-0" style="font-size: 1rem;">${post.user.username}</h5>
                        <small style="color: #aaa;">${post.user.occupation || 'Membro da Comunidade'}</small>
                    </div>
                </div>
                
                <div class="post-body mb-3">
                    ${post.tema ? `<span class="badge-topic mb-2 d-inline-block">${post.tema}</span>` : ''}
                    <p style="color: #ddd; white-space: pre-line;">${post.content}</p>
                    
                    ${post.link ? `
                        <a href="${post.link}" target="_blank" class="text-info d-flex align-items-center gap-2 p-2 rounded" style="background: rgba(0,242,255,0.1); text-decoration: none;">
                            <i class="ph-bold ph-link"></i> ${post.link}
                        </a>` : ''}
                </div>

                <div class="d-flex gap-4 border-top border-secondary pt-3">
                    <button class="action-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}', ${post.likes}, ${post.isLiked})">
                        <i class="ph-fill ph-heart"></i> ${post.likes} Curtidas
                    </button>
                    <button class="action-btn" onclick="toggleComments('${post.id}')">
                        <i class="ph-bold ph-chat-circle"></i> ${post.comments.length} Comentários
                    </button>
                </div>

                <div id="comments-${post.id}" class="comments-section" style="display: none;">
                    <div class="comments-list mb-3" style="max-height: 200px; overflow-y: auto;">
                        ${post.comments.length ? post.comments.map(c => `
                            <div class="single-comment">
                                <div class="comment-user">${c.user}</div>
                                <p class="comment-text">${c.text}</p>
                            </div>
                        `).join('') : '<small class="text-muted">Nenhum comentário ainda.</small>'}
                    </div>
                    
                    <form onsubmit="submitComment(event, '${post.id}')" class="d-flex gap-2">
                        <input type="text" class="form-control form-control-sm" placeholder="Escreva um comentário..." required>
                        <button type="submit" class="btn btn-sm btn-primary"><i class="ph-bold ph-paper-plane-right"></i></button>
                    </form>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = '<p class="text-danger text-center">Erro ao carregar posts.</p>';
    }
}

// --- CRIAR POST ---
async function handleNewPost(e) {
    e.preventDefault();
    const tema = document.getElementById('post-tema').value;
    const msg = document.getElementById('post-msg').value;
    const link = document.getElementById('post-link').value;

    const novoPost = {
        user: {
            username: "@" + currentUser.login,
            avatarUrl: null,
            age: "N/A",
            location: currentUser.localizacao || "Brasil",
            occupation: currentUser.profissao || "Estudante"
        },
        content: msg,
        link: link || null,
        tema: tema || null,
        comments: [],
        likes: 0,
        isLiked: false
    };

    try {
        await fetch(`${'https://tech-edu-api-json.onrender.com'}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPost)
        });
        
        // Limpa form e recarrega
        e.target.reset();
        loadPosts();
    } catch (error) {
        alert("Erro ao publicar.");
    }
}

// --- CURTIR ---
window.toggleLike = async (id, currentLikes, isLiked) => {
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    
    await fetch(`${'https://tech-edu-api-json.onrender.com'}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: newLikes, isLiked: !isLiked })
    });
    loadPosts();
};

// --- COMENTAR ---
window.submitComment = async (e, postId) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const text = input.value;

    // 1. Pega o post para não perder comentários antigos
    const res = await fetch(`${'https://tech-edu-api-json.onrender.com'}/posts/${postId}`);
    const post = await res.json();

    const newComment = {
        user: "@" + currentUser.login,
        text: text
    };

    // 2. Atualiza
    await fetch(`${'https://tech-edu-api-json.onrender.com'}/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: [...post.comments, newComment] })
    });

    // 3. Recarrega e reabre a aba de comentários
    await loadPosts();
    const commentsDiv = document.getElementById(`comments-${postId}`);
    if(commentsDiv) commentsDiv.style.display = 'block';
};

// --- MOSTRAR/ESCONDER COMENTÁRIOS ---
window.toggleComments = (id) => {
    const el = document.getElementById(`comments-${id}`);
    if(el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};