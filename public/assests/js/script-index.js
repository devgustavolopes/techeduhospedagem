// --- 1. CAROUSEL LOGIC ---
const bgSlides = document.querySelectorAll(".bg-slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
let currentSlide = 0;
let slideInterval;

function updateSlide(index) {
    // Limpa estado ativo
    bgSlides.forEach(slide => slide.classList.remove("active"));
    
    // Calcula novo índice (Loop Infinito)
    if (index >= bgSlides.length) currentSlide = 0;
    else if (index < 0) currentSlide = bgSlides.length - 1;
    else currentSlide = index;

    // Ativa novo slide
    bgSlides[currentSlide].classList.add("active");
}

function startAutoSlide() {
    slideInterval = setInterval(() => updateSlide(currentSlide + 1), 5000);
}

function resetTimer() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Event Listeners dos botões
if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
        updateSlide(currentSlide + 1);
        resetTimer();
    });

    prevBtn.addEventListener("click", () => {
        updateSlide(currentSlide - 1);
        resetTimer();
    });
}

// Inicia o slide automático
startAutoSlide();


// --- 2. FAQ LOGIC ---
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
        // Fecha os outros (efeito sanfona)
        faqItems.forEach(otherItem => {
            if (otherItem !== item) otherItem.classList.remove("active");
        });
        // Alterna o atual
        item.classList.toggle("active");
    });
});


// --- 3. ANIMATED COUNTERS (Números subindo) ---
const counters = document.querySelectorAll('.counter');
const speed = 200; // Quanto maior, mais lento

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '').replace('k', '000'); // Limpa formatação básica
            
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                // Formatação final (adiciona K se necessário)
                if(target >= 1000) {
                    counter.innerText = "+" + (target / 1000) + "k";
                } else {
                    counter.innerText = "+" + target;
                }
            }
        };
        updateCount();
    });
};

// Ativa a animação apenas quando a seção de estatísticas aparece na tela
let animationStarted = false;
const statsSection = document.querySelector('.stats-section');

if (statsSection) {
    window.addEventListener('scroll', () => {
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !animationStarted) {
            animateCounters();
            animationStarted = true;
        }
    });
}