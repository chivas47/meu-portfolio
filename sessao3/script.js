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


// ============================================================
//  SESSÃO 3: GALERIA DINÂMICA DE PROJETOS
//  Array de projetos + Filtros + Modal + Pesquisa
// ============================================================


// ============================================================
//  DADOS — Array de Projetos
// ============================================================

const projects = [
    {
        id: 1,
        title: 'E-commerce Website',
        category: 'web',
        description: 'Loja online completa com carrinho de compras',
        image: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=E-commerce',
        tags: ['HTML', 'CSS', 'JavaScript', 'API'],
        link: '#',
        longDescription: 'Website de e-commerce completo com sistema de carrinho, checkout e integração com API de pagamentos. Interface moderna e responsiva.',
        features: ['Carrinho de compras', 'Sistema de pagamento', 'Área de utilizador', 'Gestão de produtos'],
        technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'LocalStorage', 'Fetch API'],
        date: '2025-01'
    },
    {
        id: 2,
        title: 'App de Tarefas',
        category: 'web',
        description: 'Gestor de tarefas com filtros e categorias',
        image: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Todo+App',
        tags: ['JavaScript', 'CSS', 'LocalStorage'],
        link: '#',
        longDescription: 'Aplicação de gestão de tarefas com sistema de prioridades, categorias e persistência local.',
        features: ['Adicionar/editar/remover tarefas', 'Filtros por estado', 'Categorias', 'Persistência de dados'],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
        date: '2024-12'
    },
    {
        id: 3,
        title: 'Portfolio Designer',
        category: 'design',
        description: 'Portfolio criativo para designer gráfico',
        image: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Portfolio',
        tags: ['Figma', 'UI/UX', 'Protótipo'],
        link: '#',
        longDescription: 'Design de portfolio minimalista e elegante para apresentar trabalhos criativos.',
        features: ['Design responsivo', 'Animações suaves', 'Galeria de trabalhos', 'Formulário de contacto'],
        technologies: ['Figma', 'Design System', 'Prototyping'],
        date: '2024-11'
    },
    {
        id: 4,
        title: 'App Meteorologia',
        category: 'mobile',
        description: 'App mobile para consultar previsão do tempo',
        image: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Weather+App',
        tags: ['React Native', 'API', 'Mobile'],
        link: '#',
        longDescription: 'Aplicação mobile para consultar previsão meteorológica com dados em tempo real.',
        features: ['Previsão 7 dias', 'Localização automática', 'Alertas meteorológicos', 'Favoritos'],
        technologies: ['React Native', 'Weather API', 'Geolocation'],
        date: '2025-01'
    },
    {
        id: 5,
        title: 'Dashboard Analytics',
        category: 'web',
        description: 'Dashboard com gráficos e estatísticas',
        image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Dashboard',
        tags: ['JavaScript', 'Chart.js', 'API'],
        link: '#',
        longDescription: 'Dashboard interativo para visualização de dados e analytics com gráficos dinâmicos.',
        features: ['Gráficos interativos', 'Filtros de data', 'Exportar relatórios', 'Dados em tempo real'],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Fetch API'],
        date: '2024-10'
    },
    {
        id: 6,
        title: 'Redesign Logo Empresa',
        category: 'design',
        description: 'Redesign de identidade visual corporativa',
        image: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Logo+Design',
        tags: ['Illustrator', 'Branding', 'Logo'],
        link: '#',
        longDescription: 'Projeto de redesign completo de identidade visual incluindo logo, cores e tipografia.',
        features: ['Logo principal', 'Variações', 'Manual de marca', 'Mockups'],
        technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign'],
        date: '2024-09'
    }
];

// Estado atual do filtro (usado também pela pesquisa)
let currentCategory = 'all';


// ============================================================
//  RENDERIZAR PROJETOS
// ============================================================

function renderProjects(projectsToRender) {
    const grid      = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');

    if (!grid) return;

    grid.innerHTML = '';

    if (projectsToRender.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    projectsToRender.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });

    updateCounters();
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className    = 'project-card';
    card.dataset.id   = project.id;
    card.dataset.category = project.category;

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div class="project-card-body">
            <span class="project-category">${project.category}</span>
            <h3>${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    return card;
}

function updateCounters() {
    const counts = {
        all:    projects.length,
        web:    projects.filter(p => p.category === 'web').length,
        mobile: projects.filter(p => p.category === 'mobile').length,
        design: projects.filter(p => p.category === 'design').length,
    };

    Object.keys(counts).forEach(cat => {
        const btn = document.querySelector(`[data-category="${cat}"] .count`);
        if (btn) btn.textContent = counts[cat];
    });
}


// ============================================================
//  FILTROS POR CATEGORIA
// ============================================================

function filterProjects(category) {
    currentCategory = category;

    // Limpar pesquisa quando muda o filtro
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const filtered = category === 'all'
        ? projects
        : projects.filter(p => p.category === category);

    renderProjects(filtered);
    console.log(`🏷️ Filtro: ${category} (${filtered.length} projetos)`);
}

function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProjects(button.dataset.category);
        });
    });
}


// ============================================================
//  MODAL DE DETALHES
// ============================================================

function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <span class="modal-category">${project.category}</span>
        <h2 id="modal-title">${project.title}</h2>
        <img src="${project.image}" alt="${project.title}" class="modal-image">

        <div class="modal-section">
            <h3>Sobre o Projeto</h3>
            <p>${project.longDescription}</p>
        </div>

        <div class="modal-section">
            <h3>Funcionalidades</h3>
            <ul>
                ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>Tecnologias Utilizadas</h3>
            <div class="modal-tech">
                ${project.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
        </div>

        <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="modal-link">
            Ver Projeto Completo →
        </a>
    `;

    const modal = document.getElementById('project-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log(`🔍 Modal aberto: ${project.title}`);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('Modal fechado');
}

function setupModalListeners() {
    // Event delegation — listener no grid, detecta clique no card
    const grid = document.getElementById('projects-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) openModal(parseInt(card.dataset.id));
        });
    }

    // Fechar com botão X
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Fechar ao clicar no overlay (fora do conteúdo)
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Fechar com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}


// ============================================================
//  PESQUISA EM TEMPO REAL (com debounce)
// ============================================================

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function searchProjects(query) {
    const term = query.toLowerCase().trim();

    if (term === '') {
        filterProjects(currentCategory);
        return;
    }

    const base = currentCategory === 'all'
        ? projects
        : projects.filter(p => p.category === currentCategory);

    const results = base.filter(project =>
        project.title.toLowerCase().includes(term)       ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
    );

    renderProjects(results);
    console.log(`🔎 Pesquisa: "${query}" — ${results.length} resultado(s)`);
}

const debouncedSearch = debounce(searchProjects, 280);

function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });

    // Escape: limpar pesquisa
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchProjects('');
            searchInput.blur();
        }
    });
}


// ============================================================
//  INICIALIZAÇÃO — adicionar à DOMContentLoaded existente
// ============================================================

// Sessão 3 bootstraps para a mesma DOMContentLoaded do ficheiro
document.addEventListener('DOMContentLoaded', () => {
    renderProjects(projects);
    setupFilterListeners();
    setupModalListeners();
    setupSearchListener();
    console.log('✅ Sessão 3: Galeria de projetos pronta!');
});