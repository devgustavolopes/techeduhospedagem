// CORREÇÃO ESSENCIAL: Adicione o protocolo para que o navegador a reconheça como uma URL válida.
const API_URL = 'https://techeduvercel.vercel.app';
// O uso no 'fetch' já está correto: fetch(`${API_URL}/posts`)
let replyModalObj = null;

// --- DADOS DO EMAILJS (Substitua pelos seus dados reais) ---
const EMAILJS_PUBLIC_KEY = '7SH-eQPuP4ygPWwvL'; // Seu User ID/Public Key
const EMAILJS_SERVICE_ID = 'service_oc8p8t9'; // Seu Service ID
const EMAILJS_TEMPLATE_ID = 'template_tjrlnso'; // Seu Template ID

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o Modal do Bootstrap
    const modalEl = document.getElementById('modalResposta');
    if (modalEl) {
        // @ts-ignore
        replyModalObj = new bootstrap.Modal(modalEl);
    }

    // Carrega as mensagens
    loadMessages();

    // Configura o formulário de resposta
    const formResposta = document.getElementById('form-resposta');
    if (formResposta) {
        // Agora o submit chama a nova lógica unificada
        formResposta.addEventListener('submit', handleReplySubmit);
    }
});

// --- FUNÇÕES DE CARREGAMENTO, MODAL E EXCLUSÃO (Inalteradas, exceto a chamada no botão) ---

async function loadMessages() {
    const tbody = document.getElementById('lista-contatos');
    
    // Elementos dos contadores
    const elTotal = document.getElementById('count-total');
    const elPending = document.getElementById('count-pending');
    const elAnswered = document.getElementById('count-answered');

    try {
        const res = await fetch('techeduvercel.vercel.app');
        const messages = await res.json();

        // --- LÓGICA DOS CONTADORES ---
        const total = messages.length;
        const respondidos = messages.filter(m => m.respondido === true).length;
        const pendentes = total - respondidos;

        if(elTotal) elTotal.innerText = total;
        if(elAnswered) elAnswered.innerText = respondidos;
        if(elPending) elPending.innerText = pendentes;

        // --- RENDERIZAÇÃO DA TABELA ---
        if (total === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        Nenhuma mensagem encontrada.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = messages.map(msg => {
            // AQUI ESTÁ A MÁGICA DO BOTÃO
            // Se já foi respondido, mostra o Check Verde. Se não, mostra o Botão.
            // ATENÇÃO: Adicionei nome e assunto para passar ao modal
            const botaoAcao = msg.respondido 
                ? `<span class="badge bg-success p-2 me-2" style="cursor: default; font-weight: 500;">
                     <i class="ph-bold ph-check"></i> Respondido
                   </span>`
                : `<button class="btn btn-sm btn-outline-primary me-2" 
                         onclick='openReplyModal("${msg.id}", "${msg.email}", "${msg.conteudoctt || msg.mensagem || ''}", "${msg.nome}", "${msg.assuntoctt || msg.assunto || 'Sem Assunto'}")'
                         title="Responder">
                         <i class="ph-bold ph-arrow-u-up-left"></i>
                    </button>`;

            return `
            <tr>
                <td class="ps-4 fw-bold text-white">${msg.nome}</td>
                <td>${msg.email}</td>
                <td>${msg.assuntoctt || msg.assunto || '<span class="text-muted">Sem assunto</span>'}</td>
                <td>
                    <span class="d-inline-block text-truncate" style="max-width: 200px; color: #aaa;">
                        ${msg.conteudoctt || msg.mensagem || ''}
                    </span>
                </td>
                <td>
                    ${msg.linkctt ? `<a href="${msg.linkctt}" target="_blank" class="text-info text-decoration-none"><i class="ph-bold ph-link"></i> Link</a>` : '-'}
                </td>
                <td class="text-end pe-4">
                    
                    ${botaoAcao}
                    
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="deleteMessage('${msg.id}')"
                            title="Excluir">
                        <i class="ph-bold ph-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar mensagens.</td></tr>`;
    }
}

// Função Global para abrir o modal (Atualizada com nome e assunto)
window.openReplyModal = (id, email, msgOriginal, nome, assunto) => {
    // Campos necessários para a API do EmailJS
    document.getElementById('contato-id-hidden').value = id;
    document.getElementById('email-destinatario').value = email;
    // Novos campos para os dados do EmailJS
    document.getElementById('nome-destinatario-hidden').value = nome;
    document.getElementById('assunto-original-hidden').value = assunto;
    document.getElementById('mensagem-original-hidden').value = msgOriginal; // Adicionado para Template Params

    // Exibição no modal
    document.getElementById('original-message-display').innerText = msgOriginal || "Conteúdo indisponível";
    document.getElementById('corpo-resposta').value = ''; 
    
    if(replyModalObj) replyModalObj.show();
};


// Função Global para excluir mensagem
window.deleteMessage = async (id) => {
    if(confirm('Tem certeza que deseja excluir esta mensagem?')) {
        try {
            await fetch(`${'techeduvercel.vercel.app'}/${id}`, { method: 'DELETE' });
            loadMessages(); 
        } catch (error) {
            alert('Erro ao excluir mensagem.');
        }
    }
};

// --- NOVA LÓGICA DE ENVIO UNIFICADA ---
async function handleReplySubmit(e) {
    e.preventDefault();
    
    // 1. Coleta de dados
    const id = document.getElementById('contato-id-hidden').value;
    const email = document.getElementById('email-destinatario').value;
    const resposta = document.getElementById('corpo-resposta').value;

    // Dados adicionais (usados no EmailJS)
    const nomeDestinatario = document.getElementById('nome-destinatario-hidden').value;
    const assuntoOriginal = document.getElementById('assunto-original-hidden').value;
    const mensagemOriginal = document.getElementById('mensagem-original-hidden').value;

    if(!resposta.trim()) return alert("Escreva uma resposta!");

    const btnEnviarResposta = document.getElementById('btn-enviar-resposta');
    if (btnEnviarResposta) {
        btnEnviarResposta.disabled = true;
        btnEnviarResposta.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';
    }


    try {
        // --- ETAPA 1: ENVIAR E-MAIL PELO EMAILJS ---
        const templateParams = {
            nome_destinatario: nomeDestinatario,
            email_destinatario: email,
            assunto_original: assuntoOriginal,
            mensagem_original: mensagemOriginal,
            corpo_da_minha_resposta: resposta
        };

        const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: templateParams
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!emailJsResponse.ok) {
            // Se o EmailJS falhar, lança um erro para ir para o bloco catch
            throw new Error(`Falha ao enviar e-mail via EmailJS: ${emailJsResponse.statusText}`);
        }
        
        // --- ETAPA 2: MARCAR COMO RESPONDIDO NO SEU SERVIDOR (APENAS SE O EMAIL FOR ENVIADO) ---
        await fetch(`${'https://api.emailjs.com/api/v1.0/email/send'}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                respondido: true, 
                dataResposta: new Date().toISOString(),
                respostaAdmin: resposta 
            })
        });

        alert(`✅ Resposta enviada para ${email} e status atualizado!`);
        
        if(replyModalObj) replyModalObj.hide();
        loadMessages(); 

    } catch (error) {
        console.error('Erro no fluxo de resposta:', error);
        alert(`❌ Ocorreu um erro: ${error.message || 'Falha ao enviar e/ou atualizar status.'}`);
    } finally {
        // Volta o botão ao estado normal
        if (btnEnviarResposta) {
            btnEnviarResposta.disabled = false;
            btnEnviarResposta.innerHTML = 'Enviar Resposta';
        }
    }
}