// Arquivo: script-contato.js

// Importa o cliente Supabase
import { supabase } from './supabaseClient.js'; // Caminho relativo ao script principal, ajuste se necessário

// REMOVIDO: const API_URL = 'techeduvercel.vercel.app';
const API_CONTATOS_URL = 'contatos'; // Usaremos apenas o nome da tabela

document.addEventListener("DOMContentLoaded", function() {
    
    // --- Parte 1: Lógica do "Inserir Link" (Inalterada) ---\r\n
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

    // --- Parte 2: Validação e Submissão AJAX (MODIFICADA PARA SUPABASE) ---\r\n

    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('form-submission-status'); 

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Validação
        const inputs = [
            document.getElementById('fullName'),
            document.getElementById('emailInput'),
            document.getElementById('subjectInput'),
            document.getElementById('messageTextarea')
        ];
        
        resetValidation(inputs);
        
        const nome = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const assunto = inputs[2].value.trim();
        const mensagem = inputs[3].value.trim();
        const link = linkInput.value.trim();
        
        let isValid = true;
        if (!nome) { showError(inputs[0]); isValid = false; }
        if (!email || !isValidEmail(email)) { showError(inputs[1]); isValid = false; }
        if (!assunto) { showError(inputs[2]); isValid = false; }
        if (!mensagem) { showError(inputs[3]); isValid = false; }
        
        if (!isValid) {
            statusMessage.innerHTML = 'Por favor, preencha todos os campos obrigatórios corretamente.';
            statusMessage.className = 'mt-3 alert alert-warning';
            return;
        }

        // 2. Preparação dos dados
        const messageData = {
            nome,
            email,
            assunto,
            mensagem,
            link: link || null, // Salva o link se existir
            dataEnvio: new Date().toISOString(),
            respondido: false // Estado inicial
        };

        // 3. Submissão (POST)
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        statusMessage.innerHTML = '';
        statusMessage.className = '';

        // 🚨 CORREÇÃO POST: Usando Supabase para enviar a mensagem
        supabase
            .from(API_CONTATOS_URL)
            .insert([messageData])
            .then(({ error }) => {
                if (error) {
                    throw new Error(`Falha ao enviar mensagem: ${error.message}`);
                }
                
                // Sucesso
                statusMessage.innerHTML = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
                statusMessage.className = 'mt-3 alert alert-success';
                contactForm.reset();
                if (linkInputWrapper.classList.contains('is-visible')) {
                    showLinkBtn.click();
                }

            })
            .catch(error => {
                console.error('Erro de submissão:', error);
                statusMessage.innerHTML = `Oops! Erro de conexão. Detalhe: ${error.message}`;
                statusMessage.className = 'mt-3 alert alert-danger';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar';
            });
    });

    // --- Funções Auxiliares ---\r\n
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