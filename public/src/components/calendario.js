// Criar uma verificação de Id Token futuramente
// import { auth } from '../../auth/permissions.js'; // Mantido comentado como no seu código

// Esta função será chamada quando uma tarefa no calendário for clicada.
import { openTaskFormForEdit } from "./sidebar.js";

const calendarGrid = document.getElementById("calendar-grid");
const currentMonthDisplay = document.getElementById("current-month");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();
let tasks = [];

/**
 * @function initializeCalendar
 * @description Inicia a renderização do calendário e configura os listeners de navegação.
 * Esta é a função principal para ser chamada do main.js.
 * Exportada para uso externo.
 */
export function initializeCalendar() {
  if (!calendarGrid || !currentMonthDisplay) {
    console.error(
      "Elementos essenciais do calendário (calendar-grid ou current-month) não encontrados."
    );
    return;
  }

  // Renderiza a estrutura do grid do calendário para o mês atual.
  renderCalendarGrid();

  if (prevMonthBtn) {
    prevMonthBtn.onclick = null;
    prevMonthBtn.onclick = () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendarGrid();
      fetchAndRenderTasks();
    };
  }

  if (nextMonthBtn) {
    nextMonthBtn.onclick = null;
    nextMonthBtn.onclick = () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendarGrid();
      fetchAndRenderTasks();
    };
  }
}

/**
 * @function renderCalendarGrid
 * @description Calcula e desenha as células dos dias para o mês atual no grid do calendário.
 */
function renderCalendarGrid() {
  calendarGrid.innerHTML = "";

  currentMonthDisplay.textContent = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const numDaysInMonth = lastDayOfMonth.getDate();

  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-cell", "empty");
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= numDaysInMonth; day++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    cell.innerHTML = `<span class="day-number">${day}</span>`;
    cell.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    calendarGrid.appendChild(cell);
  }

  const totalCells = calendarGrid.children.length;
  const remainingCells = 42 - totalCells;
  for (let i = 0; i < remainingCells; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-cell", "empty");
    calendarGrid.appendChild(emptyCell);
  }
}

/**
 * @function fetchAndRenderTasks
 * @description Busca as tarefas do backend (`/api/puxarTarefas`), atualiza o array 'tasks' local
 * e então chama `renderTasksOnCalendar` para exibi-las no calendário.
 * Exportada para ser chamada por main.js (no carregamento inicial) e
 * por sidebar.js (após adicionar/atualizar uma nova tarefa).
 */
export async function fetchAndRenderTasks() {
  try {
    let headers = {
      "Content-Type": "application/json",
    };

    // ANALISAR AO CRIAR VERIFYIDTOKEN FUTURAMENTE
    // Se a rota `/api/puxarTarefas` for protegida no backend (com verifyIdToken),
    // este bloco será ativado para enviar o token do usuário logado.
    // if (auth.currentUser) {
    //     const idToken = await auth.currentUser.getIdToken();
    //     headers['Authorization'] = `Bearer ${idToken}`;
    // } else {
    //     console.warn("Nenhum usuário logado. Tentando buscar tarefas sem token.");
    // }

    const response = await fetch("/api/puxarTarefas", {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error(
          "Não autorizado para buscar tarefas. Redirecione para login se necessário."
        );
        // FUTURAMENTE: Redirecionar para página de login se a rota for protegida e a página deve ser privada.
        // window.location.href = '/login.html';
      }
      const errorData = await response.json();
      throw new Error(
        `Erro HTTP! Status: ${response.status} - ${errorData.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    tasks = data;
    console.log("Tarefas carregadas do backend:", tasks);

    renderTasksOnCalendar();
  } catch (error) {
    console.error("Erro ao buscar tarefas do backend:", error);
  }
}

/**
 * @function renderTasksOnCalendar
 * @description Coloca as tarefas (do array 'tasks') nas células dos dias correspondentes
 * no calendário atualmente exibido, tornando-as clicáveis para edição.
 */
function renderTasksOnCalendar() {
  if (!calendarGrid) return;

  // Remove todas as divs de tarefas existentes para evitar duplicatas ao re-renderizar.
  document.querySelectorAll(".calendar-cell .task").forEach((t) => t.remove());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  tasks.forEach((task) => {
    // Valida se a tarefa possui uma data válida e tenta convertê-la.
    if (!task.dataInsercao || isNaN(new Date(task.dataInsercao))) {
      console.warn("Tarefa com data inválida ou ausente, ignorando:", task);
      return;
    }
    const taskDate = new Date(task.dataInsercao);

    // Verifica se a tarefa pertence ao mês e ano atualmente exibidos no calendário.
    if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
      const day = taskDate.getDate(); // Obtém o dia do mês da tarefa.

      // Encontra a célula do calendário correspondente ao dia da tarefa usando `data-date`.
      const targetDateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const cell = calendarGrid.querySelector(
        `[data-date="${targetDateString}"]`
      );

      if (cell) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        //Mudar cor de acordo com a data de entrega
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataLimite = new Date(task.date);
        dataLimite.setHours(0, 0, 0, 0);

        if (dataLimite > hoje) {
          task.status = "dentro do prazo";
          taskDiv.classList.add("task-status-em-desenvolvimento");
        } else if (dataLimite.getTime() === hoje.getTime()) {
          task.status = "dia limite";
          taskDiv.classList.add("task-status-em-limite");
        } else {
          task.status = "atrasada";
          taskDiv.classList.add("task-status-atrasada");
        }

        const dia = String(dataLimite.getDate()).padStart(2, '0');
        const mes = String(dataLimite.getMonth() + 1).padStart(2, '0');
        const ano = dataLimite.getFullYear();

        const dataLimiteFinal = `${dia}/${mes}/${ano}`;

        taskDiv.textContent = `${task.cliente} - ${dataLimiteFinal} - ${task.type} `;

        // ==============================================================
        // TORNANDO A TAREFA CLICÁVEL PARA EDIÇÃO
        // ==============================================================
        taskDiv.addEventListener("click", () => {
          openTaskFormForEdit(task);
        });
        cell.appendChild(taskDiv);
      }
    }
  });
}
