// ...
// O restante do código do script-login.js permanece igual
// ...

// Localize esta função (ou similar)
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ... código de validação ...

    try {
        // --- PASSO IMPORTANTE: VERIFICAÇÃO DE DUPLICIDADE ---
        // Aqui é onde corrigimos a rota
        const COLLECTION_NAME = '/users'; // <-- VERIFIQUE O NOME DA SUA COLEÇÃO NO db.json
        
        // CORRIGIDO: Adiciona /users (ou /usuarios) à URL
        const response = await fetch(`${'https://tech-edu-api-json.onrender.com'}${COLLECTION_NAME}?login=${login}`);
        
        const existingUsers = await response.json();

        if (existingUsers.length > 0) {
            alert(`O usuário \"${login}\" já está em uso. Escolha outro.`);
            return;
        }

        // Se chegou aqui, o usuário está livre. Pode cadastrar!
        addUser(nome, login, senha, email);

    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        // Esta mensagem de erro deve desaparecer após esta correção
        alert("Erro de conexão ao verificar disponibilidade do usuário."); 
    }
});

// ... o restante do arquivo ...