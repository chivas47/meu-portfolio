// Seleciona o botão de toggle
const themeToggle = document.getElementById('theme-toggle');

// Verifica se já existe preferência salva
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Event listener para alternar tema
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Salva preferência no localStorage
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Atualiza o ano no footer
document.getElementById('year').textContent = new Date().getFullYear();