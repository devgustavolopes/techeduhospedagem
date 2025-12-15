// Arquivo: admin-contato.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app';
let replyModalObj = null;

// --- DADOS DO EMAILJS (Inalterados, usados para enviar o e-mail) ---\r\n
const EMAILJS_PUBLIC_KEY = '7SH-eQPuP4ygPWwvL'; 
const EMAILJS_SERVICE_ID = 'service_oc8p8t9'; 
const EMAILJS_TEMPLATE_ID = 'template_tjrlnso'; 

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
        formResposta.addEventListener('submit', handleReplySubmit);
    }
});

// --- CARREGAR MENSAGENS (GET) - AGORA USANDO SUPABASE --
async function loadMessages() {
    const tbody = document.getElementById('lista-contatos');
    
    // Elementos dos contadores
    const elTotal = document.getElementById('count-total');
    const elPending = document.getElementById('count-pending');

    try {
        // 🚨 CORREÇÃO GET: Busca todas as mensagens
        const { data: messages, error } = await supabase
            .from('contatos')
            .select('*')
            .order('dataEnvio', { ascending: false }); // Últimas mensagens primeiro

        if (error) throw new Error(error.message);

        // Contadores
        const totalCount = messages.length;
        const pendingCount = messages.filter(m => !m.respondido).length;
        
        if (elTotal) elTotal.innerText = totalCount.toString();
        if (elPending) elPending.innerText = pendingCount.toString();

        // Renderização
        let html = '';
        if (messages.length === 0) {
            html = '<tr><td colspan="5" class="text-center py-4 text-light-gray">Nenhuma mensagem de contato recebida.</td></tr>';
        } else {
            messages.forEach(msg => {
                const statusBadge = msg.respondido 
                    ? '<span class="badge bg-success-light text-success">Respondido</span>' 
                    : '<span class="badge bg-warning-light text-warning">Pendente</span>';
                
                const deleteBtn = `<button class="btn btn-sm btn-outline-danger" onclick="deleteMessage('${msg.id}')">Excluir</button>`;
                const replyBtn = !msg.respondido 
                    ? `<button class="btn btn-sm btn-primary ms-2" onclick="openReply('${msg.id}', '${msg.email}', '${msg.mensagem.replace(/'/g, "\\'")}')">Responder</button>` 
                    : `<button class="btn btn-sm btn-outline-secondary ms-2" disabled>Respondido</button>`;

                html += `
                    <tr>
                        <td>${msg.id}</td>
                        <td class="text-primary fw-bold">${msg.nome}</td>
                        <td>${msg.email}</td>
                        <td>${statusBadge}</td>
                        <td>${new Date(msg.dataEnvio).toLocaleString()}</td>
                        <td class="text-end">${deleteBtn}${replyBtn}</td>
                    </tr>
                `;
            });
        }

        if(tbody) tbody.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        if(tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-danger">Falha ao carregar mensagens. Verifique a conexão.</td></tr>';
    }
}

// --- LÓGICA DE RESPOSTA (PATCH) - AGORA USANDO SUPABASE --
window.openReply = (id, email, originalMsg) => {
    // Armazena dados no formulário e abre o modal
    const form = document.getElementById('form-resposta');
    if (form) {
        // @ts-ignore
        form.dataset.id = id;
        // @ts-ignore
        form.dataset.email = email;
    }
    
    document.getElementById('email-destinatario').innerText = email;
    document.getElementById('original-message').innerText = originalMsg;
    
    if(replyModalObj) replyModalObj.show();
};

async function handleReplySubmit(e) {
    e.preventDefault();
    
    // @ts-ignore
    const id = e.target.dataset.id;
    // @ts-ignore
    const email = e.target.dataset.email;
    const resposta = document.getElementById('textarea-resposta').value.trim();
    
    if (!id || !email || !resposta) {
        alert("Erro interno ou resposta vazia.");
        return;
    }

    const btn = e.submitter;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

    const templateParams = {
        to_email: email,
        admin_response: resposta,
        // Adicione mais parâmetros se necessário
    };

    try {
        // --- ETAPA 1: ENVIO DE E-MAIL (EMAILJS - INALTERADO) ---
        // Aqui o EmailJS é um serviço externo, e a chamada não falha no Vercel.
        const emailJsResponse = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
            method: 'POST',
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_id: EMAILJS_TEMPLATE_ID,
                template_params: templateParams
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!emailJsResponse.ok) {
            throw new Error(`Falha ao enviar e-mail via EmailJS: ${emailJsResponse.statusText}`);
        }
        
        // --- ETAPA 2: MARCAR COMO RESPONDIDO NO SUPABASE (PATCH) --
        // 🚨 CORREÇÃO PATCH: Usando Supabase para atualizar status
        const { error: updateError } = await supabase
            .from('contatos')
            .update({ 
                respondido: true, 
                dataResposta: new Date().toISOString(),
                respostaAdmin: resposta 
            })
            .eq('id', id);

        if(updateError) throw new Error(`Falha ao atualizar status no Supabase: ${updateError.message}`);

        alert(`✅ Resposta enviada para ${email} e status atualizado!`);
        
        if(replyModalObj) replyModalObj.hide();
        loadMessages(); 

    } catch (error) {
        console.error('Erro no fluxo de resposta:', error);
        alert(`❌ Ocorreu um erro: ${error.message || 'Falha ao enviar e/ou atualizar status.'}`);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Enviar Resposta';
        // Limpa o textarea
        document.getElementById('textarea-resposta').value = ''; 
    }
}

// --- FUNÇÃO DELETAR (DELETE) - AGORA USANDO SUPABASE ---
window.deleteMessage = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
        try {
            // 🚨 CORREÇÃO DELETE: Usando Supabase para deletar
            const { error } = await supabase
                .from('contatos')
                .delete()
                .eq('id', id);
            
            if (error) throw new Error(error.message);

            alert('Mensagem excluída.');
            loadMessages(); 
        } catch (error) {
            console.error('Erro ao excluir mensagem:', error);
            alert(`❌ Erro ao excluir mensagem. Verifique a política RLS (DELETE). Detalhe: ${error.message}`);
        }
    }
};