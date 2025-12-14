// [ A "Parte 1: Lógica do Inserir Link" continua igual ]

document.addEventListener("DOMContentLoaded", function() {
    
    // --- Parte 1: Lógica do "Inserir Link" (copie o seu código aqui) ---
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

    // Campos obrigatórios (copie os seus)
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Validar (sem alteração)
        let isValid = true;
        resetValidation([fullname, email, message]);
        // ... (copie sua lógica de validação aqui) ...
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
        
        // 2. Desabilitar botão (sem alteração)
        submitButton.disabled = true;
        submitButton.innerHTML = `
           <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
           Enviando...
        `;
        
        // 3. Coletar dados (sem alteração)
        const formData = new FormData(contactForm);
        // Converter FormData para um objeto simples que o JSON Server entende
        const data = Object.fromEntries(formData.entries());

        // 4. Enviar para o JSON Server (AQUI ESTÁ A MUDANÇA)
        fetch('https://tech-edu-api-json.onrender.com', { // URL do JSON Server
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
                // Erro
                throw new Error('Falha ao enviar para o servidor.');
            }
        })
        .catch(error => {
            // Erro de rede
            statusMessage.innerHTML = 'Oops! Erro de conexão. O JSON Server está rodando?';
            statusMessage.className = 'mt-3 alert alert-danger';
        })
        .finally(() => {
            // Reabilitar botão (sem alteração)
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar';
        });
    });

    // --- Funções Auxiliares (copie as suas aqui) ---
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