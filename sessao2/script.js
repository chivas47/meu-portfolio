// ============================================================
//  SCRIPT.JS — Portfolio Interativo
//  Sessão 2: Dark Mode + Relógio Digital + Contador de Visitas
// ============================================================


// ============================================================
//  ATIVIDADE 1: DARK / LIGHT MODE TOGGLE
// ============================================================

function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    console.log(`Tema alterado para: ${isDark ? 'escuro 🌙' : 'claro ☀️'}`);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Utilizador já escolheu — respeitar a preferência guardada
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } else {
        // Nenhuma preferência guardada — detectar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
        }
    }

    console.log(`Tema carregado: ${localStorage.getItem('theme') || 'automático (sistema)'}`);
}


// ============================================================
//  ATIVIDADE 2: RELÓGIO DIGITAL
// ============================================================

let is24Hour = true;
let clockInterval;

function updateClock() {
    const now = new Date();

    let hours   = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Converter para formato 12h se necessário
    if (!is24Hour) {
        hours = hours % 12 || 12; // 0 → 12
    }

    // Garantir sempre 2 dígitos
    hours   = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    // Atualizar os elementos do relógio
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (hoursEl)   hoursEl.textContent   = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;

    // Atualizar a data por extenso
    const dateEl = document.getElementById('date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('pt-PT', options);
    }
}

function startClock() {
    updateClock(); // Mostrar imediatamente sem esperar 1s
    clockInterval = setInterval(updateClock, 1000);
    console.log('⏰ Relógio iniciado!');
}

function toggleFormat() {
    is24Hour = !is24Hour;
    localStorage.setItem('clockFormat', is24Hour ? '24' : '12');
    updateClock();
    console.log(`Formato do relógio: ${is24Hour ? '24h' : '12h'}`);
}

function loadClockFormat() {
    const saved = localStorage.getItem('clockFormat');
    if (saved) {
        is24Hour = (saved === '24');
    }
}


// ============================================================
//  ATIVIDADE 3: CONTADOR DE VISITAS
// ============================================================

function getVisitCount() {
    const count = localStorage.getItem('visitCount');
    return count ? parseInt(count) : 0;
}

function incrementVisitCount() {
    let count = getVisitCount();
    count++;
    localStorage.setItem('visitCount', count);
    localStorage.setItem('lastVisit', new Date().toISOString());
    return count;
}

function formatLastVisit() {
    const lastVisitISO = localStorage.getItem('lastVisit');

    // Este é o primeiro acesso — ainda não havia registo
    if (!lastVisitISO) return 'Primeira vez aqui! 🎉';

    const lastVisit = new Date(lastVisitISO);
    const now       = new Date();
    const diff      = now - lastVisit; // milissegundos

    const minutes = Math.floor(diff / 1000 / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);

    if (minutes < 1)  return 'Há menos de 1 minuto';
    if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24)   return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
    return `Há ${days} dia${days > 1 ? 's' : ''}`;
}

function updateVisitDisplay() {
    const countEl = document.getElementById('visit-count');
    if (countEl) countEl.textContent = getVisitCount();
}

function updateLastVisitDisplay() {
    const lastVisitEl = document.getElementById('last-visit');
    if (lastVisitEl) lastVisitEl.textContent = formatLastVisit();
}

function resetVisitCounter() {
    const confirmed = window.confirm('Tens a certeza que queres resetar o contador?');
    if (!confirmed) return;

    localStorage.removeItem('visitCount');
    localStorage.removeItem('lastVisit');

    updateVisitDisplay();
    updateLastVisitDisplay();

    console.log('🔄 Contador resetado!');
    alert('Contador resetado com sucesso!');
}

function initVisitCounter() {
    // Guardar última visita ANTES de incrementar (para cálculo correto do "há X minutos")
    updateLastVisitDisplay();
    incrementVisitCount();
    updateVisitDisplay();
    console.log(`📊 Visita registada! Total: ${getVisitCount()}`);
}


// ============================================================
//  FOOTER — ANO AUTOMÁTICO
// ============================================================

function setFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}


// ============================================================
//  INICIALIZAÇÃO — quando o HTML está carregado
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Tema ---
    loadSavedTheme();

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // --- Relógio ---
    loadClockFormat();
    startClock();

    const formatToggleBtn = document.getElementById('format-toggle');
    if (formatToggleBtn) {
        formatToggleBtn.addEventListener('click', toggleFormat);
    }

    // --- Contador ---
    initVisitCounter();

    const resetBtn = document.getElementById('reset-counter');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetVisitCounter);
    }

    // --- Footer ---
    setFooterYear();

    console.log('✅ Portfolio carregado com sucesso!');
});