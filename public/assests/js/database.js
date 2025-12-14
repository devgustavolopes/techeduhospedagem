const studyDatabase = {
    hardware: { compatibilidade: { tasks: ["Entender o que é um soquete de CPU (ex: LGA 1700, AM5) e sua relação com a placa-mãe.", "Verificar a compatibilidade da Memória RAM (DDR4 vs DDR5) com a placa-mãe.", "Usar o site 'PC Part Picker' para simular uma montagem e checar erros."], resources: [] }, cpu_intel_amd: { tasks: ["Pesquisar as linhas atuais: Intel Core (i3, i5, i7) vs AMD Ryzen (R3, R5, R7).", "Entender a nomenclatura (ex: o que significa '14600K' ou '7800X3D'?).", "Comparar benchmarks de jogos ou produtividade para sua faixa de preço."], resources: [] }, cpu_soquetes: { tasks: ["Identificar o soquete da sua placa-mãe.", "Entender a diferença física: LGA (Intel) vs AM5 (AMD atual).", "Pesquisar o 'ciclo de vida' de um soquete (quantas gerações ele suporta)."], resources: [] }, cpu_nucleos: { tasks: ["Entender a diferença entre Núcleo (Core) e Thread.", "Entender P-Cores (Performance) e E-Cores (Eficiência) da Intel.", "Pesquisar quantos núcleos são recomendados para jogos vs. para edição de vídeo."], resources: [] }, coolers: { tasks: ["Entender a diferença: Air Cooler (ventoinha) vs Water Cooler (AIO).", "Verificar o TDP (Thermal Design Power) do seu CPU.", "Verificar o espaço livre no gabinete para o cooler (altura ou local para radiador)."], resources: [] }, pasta_termica: { tasks: ["Entender o propósito da pasta térmica.", "Aprender os métodos de aplicação (grão de arroz, 'X', espalhar).", "Saber quando é a hora de trocar a pasta térmica."], resources: [] }, mobo_formatos: { tasks: ["Conhecer os 3 principais formatos: ATX (grande), Micro-ATX (médio), Mini-ITX (pequeno).", "Verificar qual formato seu gabinete suporta.", "Entender as limitações de cada formato (menos slots de RAM e PCIe)."], resources: [] }, mobo_chipsets: { tasks: ["Entender a diferença entre chipsets (ex: A620, B760, Z790, X670).", "Listar quais recursos um chipset mais caro oferece (mais portas USB, PCIe 5.0, overclock).", "Verificar se o chipset da sua placa-mãe suporta overclock de CPU."], resources: [] }, mobo_vrm: { tasks: ["Entender o que o VRM (Voltage Regulator Module) faz: regular a energia para o CPU.", "Saber por que um VRM de boa qualidade é importante para CPUs potentes.", "Pesquisar reviews da sua placa-mãe focados na qualidade do VRM."], resources: [] }, mobo_bios: { tasks: ["Aprender a acessar a BIOS/UEFI (apertando 'DEL' ou 'F2' ao ligar).", "Saber como ativar o XMP (Intel) ou EXPO (AMD) para a Memória RAM.", "Aprender a atualizar a BIOS (e os riscos envolvidos)."], resources: [] }, ram_ddr4_ddr5: { tasks: ["Verificar se sua placa-mãe usa DDR4 ou DDR5 (são incompatíveis).", "Entender os prós e contras de cada tecnologia.", "Pesquisar se o ganho de performance do DDR5 vale a pena para seu uso."], resources: [] }, ram_frequencia: { tasks: ["Entender o que significa a Frequência (MHz) da RAM.", "Verificar qual a frequência máxima suportada pela sua placa-mãe e CPU.", "Lembrar de ativar o XMP/EXPO na BIOS para que a RAM rode na frequência comprada."], resources: [] }, ram_latencia: { tasks: ["Entender o que é Latência (CL) e como ela afeta a performance.", "Aprender a 'fórmula': A performance real é uma balança entre Frequência (alta) e Latência (baixa).", "Comparar memórias (ex: 3200MHz CL16 vs 3600MHz CL18)."], resources: [] }, ram_dual_channel: { tasks: ["Entender o que é Dual Channel (usar 2 pentes de memória para dobrar a largura de banda).", "Identificar os slots corretos na placa-mãe para ativar (geralmente A2 e B2).", "Verificar por que 2x8GB é (quase sempre) melhor que 1x16GB."], resources: [] }, gpu_nvidia_amd: { tasks: ["Pesquisar as linhas atuais: NVIDIA GeForce (RTX) vs AMD Radeon (RX).", "Entender as tecnologias exclusivas: DLSS e Ray Tracing (NVIDIA) vs FSR (AMD).", "Comparar benchmarks de performance bruta (rasterização) vs performance com Ray Tracing."], resources: [] }, gpu_vram: { tasks: ["Entender o que é VRAM (Memória de Vídeo) e para que ela serve.", "Pesquisar quanta VRAM é recomendada para jogos em 1080p, 1440p e 4K.", "Entender a diferença entre tipos de VRAM (ex: GDDR6 vs GDDR6X)."], resources: [] }, gpu_raytracing: { tasks: ["Entender o que é Ray Tracing (traçado de raios em tempo real para iluminação).", "Entender o que é DLSS (NVIDIA) e FSR (AMD) - Upscaling com IA para melhorar performance.", "Verificar o impacto de performance ao ligar o Ray Tracing."], resources: [] }, gpu_gargalo: { tasks: ["Revisar o conceito de 'gargalo' (bottleneck).", "Entender que o gargalo sempre existe, o objetivo é equilibrá-lo.", "Usar uma calculadora online para ter uma ideia (não uma regra) do gargalo."], resources: [] }, storage_hdd_ssd: { tasks: ["Entender a diferença mecânica: HDD (disco) vs SSD (memória flash).", "Comparar as velocidades de leitura e escrita de um HDD vs um SSD SATA.", "Definir por que SSDs são essenciais para o Sistema Operacional."], resources: [] }, storage_nvme: { tasks: ["Entender a diferença entre SSD SATA (cabo) e SSD NVMe (conector M.2).", "Comparar as velocidades de um NVMe Gen3 vs um NVMe Gen4.", "Verificar se sua placa-mãe tem slot M.2 e qual geração (Gen3, Gen4) ela suporta."], resources: [] }, storage_dram: { tasks: ["Entender o que é 'DRAM Cache' em um SSD.", "Saber por que SSDs com DRAM Cache são (geralmente) mais rápidos e duráveis.", "Pesquisar se o modelo de SSD que você quer comprar possui DRAM Cache."], resources: [] }, psu_potencia: { tasks: ["Entender por que a potência (Watts) da fonte é crucial.", "Usar uma calculadora de PSU para estimar o consumo total do seu PC.", "Aprender a regra de 'folga' (pegar uma fonte com 30-50% a mais do que o consumo)."], resources: [] }, psu_80plus: { tasks: ["Entender o que é a certificação 80 Plus (eficiência energética).", "Conhecer os níveis: White, Bronze, Silver, Gold, Platinum, Titanium.", "Entender que 'eficiência' não é o mesmo que 'qualidade dos componentes'."], resources: [] }, psu_modular: { tasks: ["Entender os tipos: Não-Modular (cabos fixos), Semi-Modular e Full-Modular.", "Listar os prós e contras (Modular é melhor para organização, mas mais caro).", "Definir qual tipo é melhor para o seu 'cable management'."], resources: [] }, gabinete_formatos: { tasks: ["Revisar os formatos de placa-mãe (ATX, mATX, Mini-ITX).", "Verificar se o gabinete (ex: Mid-Tower) suporta o formato da sua placa-mãe.", "Verificar o espaço para a Placa de Vídeo (comprimento) e para o CPU Cooler (altura)."], resources: [] }, gabinete_airflow: { tasks: ["Entender o conceito de 'Airflow' (fluxo de ar).", "Aprender o básico: fans frontais/inferiores (puxam ar frio), fans traseiras/superiores (expelem ar quente).", "Diferenciar entre Pressão Positiva, Negativa e Neutra."], resources: [] }, montagem: { tasks: ["Assistir a um guia completo (longo) de montagem de PC do início ao fim.", "Ler o manual da sua placa-mãe (especialmente para os cabos do painel frontal).", "Separar e organizar todos os parafusos antes de começar."], resources: [] }, troubleshooting: { tasks: ["Aprender o que fazer se o PC não ligar (verificar a fonte, o botão do gabinete).", "Aprender o que fazer se o PC liga, mas não dá vídeo (verificar RAM, GPU, conexão).", "Identificar os 'Debug LEDs' ou 'Beep Codes' da placa-mãe."], resources: [] } },

    software: {
        win_instalacao: {
            tasks: [
                "Baixar a Ferramenta de Criação de Mídia oficial da Microsoft.",
                "Criar um pendrive bootável (mínimo 8GB).",
                "Aprender a acessar a BIOS/UEFI para mudar a ordem de boot.",
                "Passar pelo processo de instalação, particionamento e criação de usuário."
            ],
            resources: []
        },
        win_personalizacao: {
            tasks: [
                "Aprender a mudar o papel de parede, tema e cores.",
                "Organizar o Menu Iniciar e a Barra de Tarefas.",
                "Explorar as Configurações do Sistema (God Mode)."
            ],
            resources: []
        },
        win_drivers: {
            tasks: [
                "Entender o que são drivers.",
                "Usar o Windows Update para baixar drivers essenciais.",
                "Aprender a baixar o driver da Placa de Vídeo (NVIDIA ou AMD) manualmente.",
                "Abrir o 'Gerenciador de Dispositivos' para verificar se há algum driver faltando."
            ],
            resources: []
        },
        linux_distros: {
            tasks: [
                "Entender o que é o Kernel Linux e o que é uma Distribuição (Distro).",
                "Conhecer as principais 'famílias': Debian (Ubuntu, Mint), Red Hat (Fedora) e Arch.",
                "Entender o que é um Ambiente de Desktop (GNOME, KDE, XFCE).",
                "Testar uma distro usando uma 'Live USB' (sem instalar)."
            ],
            resources: []
        },
        linux_terminal: {
            tasks: [
                "Aprender os comandos básicos de navegação: ls, cd, pwd.",
                "Aprender a manipular arquivos: mkdir, touch, cp, mv, rm.",
                "Entender o que é sudo e como usá-lo para permissões de administrador.",
                "Praticar a instalação de um software via terminal (ex: sudo apt install vlc)."
            ],
            resources: []
        },
        linux_apt: {
            tasks: [
                "Entender o que é um gerenciador de pacotes (como uma 'App Store' de terminal).",
                "Aprender os comandos essenciais do APT (para Debian/Ubuntu):",
                "sudo apt update (atualizar a lista de apps)",
                "sudo apt upgrade (atualizar os apps instalados)",
                "sudo apt install <pacote> e sudo apt remove <pacote>"
            ],
            resources: []
        },
        word_formatacao: {
            tasks: [
                "Parar de formatar manualmente e usar 'Estilos' (ex: Título 1, Título 2, Normal).",
                "Aprender a modificar um Estilo para que ele se aplique a todo o documento.",
                "Entender como usar Quebras de Página e Quebras de Seção."
            ],
            resources: []
        },
        word_sumario: {
            tasks: [
                "Aprender a gerar um Sumário (Índice) automático baseado nos Estilos de Título.",
                "Aprender a atualizar o sumário (clicar com o botão direito > Atualizar Campo)."
            ],
            resources: []
        },
        word_revisao: {
            tasks: [
                "Aprender a usar o 'Controlar Alterações' (Track Changes).",
                "Praticar como 'Aceitar' ou 'Rejeitar' alterações feitas por outra pessoa.",
                "Aprender a adicionar e responder comentários."
            ],
            resources: []
        },
        excel_formulas: {
            tasks: [
                "Entender a sintaxe: toda fórmula começa com =.",
                "Praticar as 5 fórmulas essenciais: SOMA, MÉDIA, MÁXIMO, MÍNIMO, CONT.NÚM.",
                "Aprender a 'travar' uma célula em uma fórmula usando $ (ex: A$1)."
            ],
            resources: []
        },
        excel_format_cond: {
            tasks: [
                "Criar uma regra simples (ex: 'Pintar de verde se o valor for > 100').",
                "Usar 'Escalas de Cor' para criar um mapa de calor.",
                "Usar 'Conjunto de Ícones' (setas, semáforos)."
            ],
            resources: []
        },
        excel_tabela_dinamica: {
            tasks: [
                "Entender o propósito: resumir grandes volumes de dados.",
                "Criar uma Tabela Dinâmica simples.",
                "Praticar arrastar campos para 'Linhas', 'Colunas', 'Valores' e 'Filtros'."
            ],
            resources: []
        },
        excel_graficos: {
            tasks: [
                "Saber quando usar cada tipo: Pizza (proporção), Barras (comparação), Linha (tendência).",
                "Criar um gráfico a partir de uma tabela de dados.",
                "Aprender a formatar o gráfico (adicionar títulos, legendas, rótulos de dados)."
            ],
            resources: []
        },
        excel_procv: {
            tasks: [
                "Entender a sintaxe: PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo]).",
                "Praticar a correspondência exata (FALSO).",
                "Aprender sobre o substituto moderno: PROCX (XLOOKUP)."
            ],
            resources: []
        },
        ppt_design: {
            tasks: [
                "Usar o 'Slide Mestre' para criar um padrão (logo, fonte) para todos os slides.",
                "Aprender a regra do 'menos é mais' (evitar excesso de texto).",
                "Usar imagens de alta qualidade (ex: Unsplash, Pexels)."
            ],
            resources: []
        },
        ppt_animacoes: {
            tasks: [
                "Diferenciar Transições (entre slides) de Animações (em elementos).",
                "Usar animações sutis (ex: 'Surgir', 'Esmaecer') para guiar a atenção.",
                "Aprender a usar o 'Painel de Animação' para controlar a ordem e o tempo."
            ],
            resources: []
        },
        navegadores_extensoes: {
            tasks: [
                "Entender o que é uma extensão de navegador.",
                "Instalar uma extensão essencial (ex: uBlock Origin para bloquear anúncios).",
                "Gerenciar extensões (desativar ou remover as que você não usa)."
            ],
            resources: []
        },
        navegadores_senhas: {
            tasks: [
                "Entender por que usar um gerenciador de senhas é crucial.",
                "Ativar o gerenciador de senhas embutido (do Google Chrome ou Firefox).",
                "Considerar usar um gerenciador dedicado (ex: Bitwarden, 1Password)."
            ],
            resources: []
        },
        email_etiqueta: {
            tasks: [
                "Aprender a escrever um 'Assunto' claro e objetivo.",
                "Usar saudações e despedidas profissionais.",
                "Aprender a usar Filtros ou Marcadores (Labels) para organizar a caixa de entrada."
            ],
            resources: []
        },
        comunicacao_teams: {
            tasks: [
                "Aprender a diferença entre Chat (conversa rápida) e Equipes/Canais (tópicos).",
                "Praticar como formatar mensagens e usar @menções.",
                "Aprender a etiqueta de reuniões online (mutar o microfone, usar o 'levantar a mão')."
            ],
            resources: []
        },
        nuvem_drive: {
            tasks: [
                "Entender a diferença entre salvar localmente vs. na nuvem.",
                "Praticar o upload e organização de arquivos em pastas.",
                "Aprender a compartilhar um arquivo ou pasta com permissões (Leitor vs. Editor)."
            ],
            resources: []
        },
        seguranca_antivirus: {
            tasks: [
                "Entender o que é um malware (vírus, ransomware, spyware).",
                "Verificar se o antivírus nativo (Microsoft Defender) está ativado.",
                "Entender o que é um Firewall."
            ],
            resources: []
        },
        seguranca_backup: {
            tasks: [
                "Entender a regra 3-2-1 do backup (3 cópias, 2 mídias, 1 fora do local).",
                "Configurar um backup automático (ex: Histórico de Arquivos do Windows ou Google Drive).",
                "Diferenciar backup (cópia de segurança) de sincronização (espelhamento)."
            ],
            resources: []
        },
        seguranca_phishing: {
            tasks: [
                "Aprender a identificar um email de phishing (remetente, urgência, links).",
                "Praticar passar o mouse sobre um link (sem clicar) para ver o endereço real.",
                "Entender o que é Autenticação de Dois Fatores (2FA) e ativá-la."
            ],
            resources: []
        },
        seguranca_vpn: {
            tasks: [
                "Entender o que uma VPN (Virtual Private Network) faz (cria um 'túnel').",
                "Saber quando usar uma VPN (redes Wi-Fi públicas, privacidade).",
                "Diferenciar VPNs pagas (confiáveis) de gratuitas (muitas vendem seus dados)."
            ],
            resources: []
        },
        manutencao_limpeza: {
            tasks: [
                "Aprender a usar a ferramenta 'Limpeza de Disco' (cleanmgr.exe) do Windows.",
                "Desinstalar programas que você não usa (Painel de Controle).",
                "Limpar o cache do seu navegador."
            ],
            resources: []
        },
        manutencao_atualizacao: {
            tasks: [
                "Entender a importância de manter o Sistema Operacional (Windows Update) atualizado.",
                "Verificar se há atualizações do navegador e de drivers (especialmente da GPU).",
                "Configurar o Windows Update para instalar atualizações fora do seu horário de uso."
            ],
            resources: []
        },
        atalhos: {
            tasks: [
                "Dominar os atalhos universais: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+S, Ctrl+F, Ctrl+P.",
                "Aprender atalhos do Windows: Alt+Tab, Win+D, Win+E, Win+L, Ctrl+Shift+Esc.",
                "Praticar o uso de atalhos no seu software principal (ex: Excel, Word, VS Code)."
            ],
            resources: []
        }
    },

    desenvolvimento: {
        logica_variaveis: {
            tasks: [
                "Entender o que é uma variável (uma 'caixa' para guardar dados).",
                "Conhecer os tipos de dados primitivos: String, Número, Booleano.",
                "Praticar declarar, inicializar e modificar o valor de uma variável em JavaScript."
            ],
            resources: []
        },
        logica_condicionais: {
            tasks: [
                "Entender a estrutura 'Se (if), Senão (else)' e 'Senão Se (else if)'.",
                "Praticar o uso de operadores de comparação: ==, ===, !=, !==, >, <, >=, <=",
                "Entender operadores lógicos: E (&&) e OU (||).",
                "Escrever um programa que decide algo (ex: 'Se nota > 7, aprovado, senão, reprovado')."
            ],
            resources: []
        },
        logica_loops: {
            tasks: [
                "Entender o conceito de repetição (loop).",
                "Aprender a usar o while (enquanto) para repetições baseadas em condição.",
                "Aprender a usar o for (para) para repetições contadas.",
                "Escrever um programa que conte de 1 a 10."
            ],
            resources: []
        },
        logica_funcoes: {
            tasks: [
                "Entender o que é uma função (um bloco de código reutilizável).",
                "Aprender a 'declarar' uma função.",
                "Aprender a 'chamar' (executar) uma função.",
                "Praticar o uso de 'parâmetros' (dados que a função recebe) e 'retorno' (dados que ela devolve)."
            ],
            resources: []
        },
        logica_arrays: {
            tasks: [
                "Entender o que é um Array (uma lista de variáveis).",
                "Aprender a acessar um item pelo seu 'índice' (posição, começando do 0).",
                "Praticar como adicionar (push) e remover (pop) itens de um array.",
                "Usar um loop for para percorrer todos os itens de um array."
            ],
            resources: []
        },
        logica_objetos: {
            tasks: [
                "Entender o que é um Objeto (uma coleção de propriedades 'chave: valor').",
                "Praticar a criação de um objeto (ex: um objeto 'carro' com propriedades 'cor' e 'ano').",
                "Aprender a acessar os valores (ex: carro.cor)."
            ],
            resources: []
        },
        poo: {
            tasks: [
                "Entender os 4 pilares: Abstração, Encapsulamento, Herança, Polimorfismo.",
                "Entender a diferença entre 'Classe' (o molde) e 'Objeto' (a instância).",
                "Praticar a criação de uma classe simples com um 'construtor'."
            ],
            resources: []
        },
        html_semantico: {
            tasks: [
                "Entender a diferença entre <div> e tags como <header>, <main>, <article>, <footer>.",
                "Aprender por que tags semânticas ajudam em acessibilidade (leitores de tela) e SEO.",
                "Refatorar um layout simples feito com <div>s para usar tags semânticas."
            ],
            resources: []
        },
        html_formularios: {
            tasks: [
                "Aprender a usar a tag <form> e os inputs mais comuns (text, email, password, checkbox).",
                "Entender a importância da tag <label> e o atributo for.",
                "Aprender a usar as tags <select> e <textarea>."
            ],
            resources: []
        },
        css_boxmodel: {
            tasks: [
                "Entender os 4 componentes: Conteúdo, Padding (interno), Border (borda), Margin (externo).",
                "Aprender a usar o Inspetor do Navegador (F12) para ver o Box Model.",
                "Entender a propriedade box-sizing: border-box e por que ela é essencial."
            ],
            resources: []
        },
        css_flexbox: {
            tasks: [
                "Entender o conceito de 'container' (display: flex) e 'itens'.",
                "Praticar as propriedades: flex-direction, justify-content, align-items.",
                "Usar flex: 1 em um item para fazê-lo crescer e ocupar o espaço.",
                "Centralizar um item na tela (vertical e horizontalmente) com Flexbox."
            ],
            resources: []
        },
        css_grid: {
            tasks: [
                "Entender o conceito de display: grid (layout 2D).",
                "Praticar a definição de colunas e linhas (grid-template-columns, grid-template-rows).",
                "Aprender a posicionar itens (grid-column, grid-row).",
                "Aprender a usar grid-template-areas para criar layouts complexos."
            ],
            resources: []
        },
        css_responsivo: {
            tasks: [
                "Entender o conceito de 'Mobile-First' (começar estilizando para o celular).",
                "Aprender a usar 'Media Queries' (ex: @media (min-width: 768px)).",
                "Praticar a criação de um layout que muda de 1 coluna (celular) para 3 colunas (desktop).",
                "Garantir que as imagens sejam responsivas (ex: max-width: 100%)."
            ],
            resources: []
        },
        css_frameworks: {
            tasks: [
                "Entender o que é um Framework CSS (biblioteca de classes prontas).",
                "Entender a diferença: Bootstrap (componentes) vs. Tailwind (utilitários).",
                "Tentar recriar um card simples usando Tailwind e depois usando Bootstrap."
            ],
            resources: []
        },
        js_dom: {
            tasks: [
                "Entender o que é o DOM (Document Object Model - a árvore de elementos HTML).",
                "Praticar a seleção de elementos: document.getElementById e document.querySelector.",
                "Praticar a manipulação de elementos: mudar texto (.textContent) e classes (.classList)."
            ],
            resources: []
        },
        js_eventos: {
            tasks: [
                "Entender o que são Eventos (ações do usuário).",
                "Praticar o addEventListener para o evento de 'click' em um botão.",
                "Praticar o evento de 'submit' em um formulário e usar event.preventDefault().",
                "Aprender sobre os eventos 'input' ou 'change' em campos de formulário."
            ],
            resources: []
        },
        js_assincrono: {
            tasks: [
                "Entender o que é código Assíncrono (que não trava a execução).",
                "Entender o que é uma 'Promise' (promessa).",
                "Aprender a usar o fetch() para fazer uma requisição a uma API pública (ex: JSONPlaceholder).",
                "Aprender a sintaxe async/await para lidar com Promises de forma limpa."
            ],
            resources: []
        },
        js_es6: {
            tasks: [
                "Entender a diferença entre var, let e const.",
                "Aprender a sintaxe de 'Arrow Functions' (=>).",
                "Praticar o uso de 'Template Literals' (strings com ${}).",
                "Aprender a usar 'Desestruturação' (destructuring) de objetos e arrays."
            ],
            resources: []
        },
        js_frameworks: {
            tasks: [
                "Entender por que Frameworks existem (para gerenciar 'estado' e reatividade).",
                "Pesquisar os 3 grandes: React, Vue e Svelte.",
                "Escolher UM e fazer o tutorial 'Quick Start' oficial dele.",
                "Construir um app simples (ex: lista de tarefas, contador) com o framework."
            ],
            resources: []
        },
        backend_nodejs: {
            tasks: [
                "Entender o que é o Node.js (JavaScript no servidor).",
                "Instalar o Node.js e o NPM (gerenciador de pacotes).",
                "Aprender a usar o NPM para instalar um pacote (ex: npm install express).",
                "Criar um servidor 'Hello World' simples usando o framework Express."
            ],
            resources: []
        },
        backend_python: {
            tasks: [
                "Instalar o Python e o PIP (gerenciador de pacotes).",
                "Entender a diferença entre os frameworks Flask (micro) e Django (completo).",
                "Aprender a criar um 'ambiente virtual' (venv).",
                "Criar um servidor 'Hello World' simples usando Flask."
            ],
            resources: []
        },
        backend_csharp: {
            tasks: [
                "Instalar o SDK do .NET.",
                "Entender o que é a plataforma .NET e a linguagem C#.",
                "Aprender a criar um novo projeto de 'Web API' (dotnet new webapi).",
                "Entender a estrutura de um 'Controller' e 'Endpoint'."
            ],
            resources: []
        },
        backend_api: {
            tasks: [
                "Entender o que é uma API (Interface de Programação de Aplicações).",
                "Entender o que é REST (um padrão de arquitetura para APIs).",
                "Conhecer os verbos HTTP: GET (buscar), POST (criar), PUT/PATCH (atualizar), DELETE (deletar).",
                "Usar uma ferramenta (Postman) para testar uma API pública (ex: JSONPlaceholder)."
            ],
            resources: []
        },
        db_sql: {
            tasks: [
                "Entender o que é um banco de dados relacional (tabelas, linhas, colunas).",
                "Aprender as 4 operações básicas (CRUD): SELECT, INSERT, UPDATE, DELETE.",
                "Praticar o WHERE para filtrar resultados e JOIN para combinar tabelas."
            ],
            resources: []
        },
        db_nosql: {
            tasks: [
                "Entender o que é um banco de dados Não-Relacional (NoSQL).",
                "Conhecer o tipo 'Documento' (ex: MongoDB) e o 'Chave-Valor' (ex: Redis).",
                "Entender o que é um documento JSON/BSON.",
                "Praticar a criação e busca de um documento no MongoDB."
            ],
            resources: []
        },
        git_basico: {
            tasks: [
                "Entender o que é Git (controle de versão).",
                "Aprender o fluxo básico: git add . (adicionar), git commit -m 'msg' (salvar), git push (enviar).",
                "Aprender a 'clonar' (git clone) e 'puxar' atualizações (git pull)."
            ],
            resources: []
        },
        git_branch: {
            tasks: [
                "Entender o que é uma 'branch' (uma linha do tempo paralela).",
                "Aprender por que nunca se deve 'commitar' direto na 'main' (ou 'master').",
                "Praticar a criação (git branch nome), troca (git checkout nome) e junção (git merge)."
            ],
            resources: []
        },
        github_pr: {
            tasks: [
                "Entender o que é GitHub (um site que hospeda repositórios Git).",
                "Aprender o fluxo de 'Fork' (copiar um projeto) e 'Pull Request' (sugerir uma mudança).",
                "Praticar a abertura de um Pull Request no seu próprio repositório."
            ],
            resources: []
        },
        devops_docker: {
            tasks: [
                "Entender o que é um 'Container' (um app 'encaixotado').",
                "Entender a diferença entre Imagem (o molde) e Container (a instância).",
                "Aprender a 'puxar' uma imagem (docker pull) e 'rodar' um container (docker run)."
            ],
            resources: []
        },
        devops_ci: {
            tasks: [
                "Entender os conceitos: CI (Integração Contínua) e CD (Entrega Contínua).",
                "Ver o que são 'GitHub Actions' (ferramenta de CI/CD do GitHub).",
                "Criar um 'workflow' simples que roda automaticamente quando você faz um 'push'."
            ],
            resources: []
        }
    }
};