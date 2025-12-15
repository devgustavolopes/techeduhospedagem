// Arquivo: js/supabaseClient.js

// Importe a função de criação do cliente
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'; 

// --- Configuração das Variáveis ---
// Para um projeto sem framework (Vanilla JS) no Vercel, você pode carregar as chaves 
// diretamente no seu código, mas em um ambiente de produção real, use as variáveis de ambiente 
// do Vercel ou um arquivo .env

// Por agora, coloque suas chaves DIRETAMENTE AQUI para testes:
const SUPABASE_URL = 'SUA_PROJECT_URL_AQUI'; 
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI'; 

// Crie o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);