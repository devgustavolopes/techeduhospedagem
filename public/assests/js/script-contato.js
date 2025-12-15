// --- CONFIGURAÇÃO DA API (CORREÇÃO CRÍTICA) ---
const API_URL = 'techeduvercel.vercel.app';
const API_CONTATOS_URL = `${API_URL}/contatos`; // ROTA CORRETA DE ENVIO PARA O JSON SERVER

document.addEventListener("DOMContentLoaded", function() {
    
    // --- Parte 1: Lógica do "Inserir Link" ---
    const showLinkBtn = document.getElementById('show-link-input');
    const linkInputWrapper = document.getElementById('link-input-wrapper');
    const linkInput = document.getElementById('linkInput');

    showLinkBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const isVisible = linkInputWrapper.classList.toggle('is-visible');
        if (isVisible) {
            showLinkBtn.innerHTML = '<i class="bi bi-x-lg"></i> Remover link';
            linkInput.focus();
        } else {
            showLinkBtn.innerHTML = '<i class="bi bi-link-45deg"></i> Inserir link';
            linkInput.value = '';
        }
    });

    // --- Parte 2: Validação e Submissão AJAX (MODIFICADA) ---

    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // A div de status que já existe no seu HTML
    const statusMessage = document.getElementById('form-submission-status'); 

    // Campos obrigatórios
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Validar
        let isValid = true;
        resetValidation([fullname, email, message]);
        
        if (fullname.value.trim() === '') {
            isValid = false;
            showError(fullname);
        }
        if (email.value.trim() === '' || !isValidEmail(email.value)) {
            isValid = false;
            showError(email);
        }
        if (message.value.trim() === '') {
            isValid = false;
            showError(message);
        }

        if (!isValid) {
            return; // Para a execução se for inválido
        }
        
        // 2. Desabilitar botão
        submitButton.disabled = true;
        submitButton.innerHTML = `
           <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
           Enviando...
        `;
        
        // 3. Coletar dados
        const formData = new FormData(contactForm);
        // Converter FormData para um objeto simples que o JSON Server entende
        const data = Object.fromEntries(formData.entries());

        // 4. Enviar para o JSON Server (CORREÇÃO APLICADA AQUI)
        fetch(API_CONTATOS_URL, { 
            method: 'POST',
            body: JSON.stringify(data), // Envia os dados como JSON
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Sucesso
                statusMessage.innerHTML = 'Mensagem enviada com sucesso!';
                statusMessage.className = 'mt-3 alert alert-success';
                contactForm.reset();
                if (linkInputWrapper.classList.contains('is-visible')) {
                    showLinkBtn.click();
                }
            } else {
                // Erro (Ex: o servidor está online mas recusou a requisição)
                throw new Error(`Falha ao enviar para o servidor. Status: ${response.status}`);
            }
        })
        .catch(error => {
            // Erro de rede ou erro lançado acima
            console.error('Erro de submissão:', error);
            statusMessage.innerHTML = 'Oops! Erro de conexão. Verifique se a API está online e configurada corretamente.';
            statusMessage.className = 'mt-3 alert alert-danger';
        })
        .finally(() => {
            // Reabilitar botão
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar';
        });
    });

    // --- Funções Auxiliares ---
    function showError(inputElement) {
        inputElement.classList.add('is-invalid');
    }

    function resetValidation(inputs) {
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
