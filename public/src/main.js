import './components/sidebar.js';

import { initializeCalendar, fetchAndRenderTasks } from './components/calendario.js';
//Criar uma verificação de Id Token futuramente
//import { auth } from "../../auth/permissions.js";

//Lógica da inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM totalmente carregado. Iniciando calendário e carregando tarefas...");

    initializeCalendar();

    await fetchAndRenderTasks();
});

//ALTERAÇÃO DE TEMA
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