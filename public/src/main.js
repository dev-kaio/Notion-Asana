import './components/sidebar.js';
import './components/calendario.js'; 

function updateThemeIcon(isDarkTheme) {
    const themeToggleButton = document.getElementById('toggle-theme-btn');
    if (themeToggleButton) {
        if (isDarkTheme) {
            themeToggleButton.innerHTML = '<i class="fa fa-sun-o"></i>';
        } else {
            themeToggleButton.innerHTML = '<i class="fa fa-moon-o"></i>';
        }
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDarkTheme = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

    updateThemeIcon(isDarkTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    let isDarkThemeOnLoad = false;

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        isDarkThemeOnLoad = true; 
    }

    updateThemeIcon(isDarkThemeOnLoad);

    const themeToggleButton = document.getElementById('toggle-theme-btn');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
});