//Sidebar da esquerda

window.w3_open = function () {
  document.getElementById("mySidebar").classList.add("active");
};

window.w3_close = function () {
  document.getElementById("mySidebar").classList.remove("active");
};

//Sidebar da direita (Adicionar Tarefa)
const addTaskBtn = document.getElementById("add-task");
const taskSidebar = document.getElementById("taskSidebar");
const closeTaskSidebarBtn = document.getElementById("closeTaskSidebar");
const taskForm = document.getElementById("taskForm");
const calendarGrid = document.getElementById("calendar-grid");

addTaskBtn.addEventListener("click", () => {
  taskSidebar.classList.add("active");
});

closeTaskSidebarBtn.addEventListener("click", () => {
  taskSidebar.classList.remove("active");
});

// Armazenar tarefas em memória (pode adaptar para salvar no backend depois)
let tasks = [];

// Função para renderizar tarefas no calendário
export function renderTasks(currentDate) {
  // Limpa tarefas atuais
  document.querySelectorAll(".task").forEach((t) => t.remove());

  tasks.forEach((task) => {
    // Encontra a célula do dia correto no calendário (pela data)
    const taskDate = new Date(task.date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Verifica se a tarefa é do mês e ano atual
    if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
      const day = taskDate.getDate();

      // Localiza a célula do dia (index no grid = startPadding + day - 1)
      const firstDay = new Date(year, month, 1).getDay();
      const startPadding = (firstDay + 6) % 7;
      const cellIndex = startPadding + day - 1;

      const cell = calendarGrid.children[cellIndex];
      if (cell) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        // Adiciona classe de cor baseado no status
        switch (task.status) {
          case "em desenvolvimento":
            taskDiv.classList.add("task-status-em-desenvolvimento");
            break;
          case "revisao":
            taskDiv.classList.add("task-status-revisao");
            break;
          case "atrasada":
            taskDiv.classList.add("task-status-atrasada");
            break;
          case "finalizada":
            taskDiv.classList.add("task-status-finalizada");
            break;
          default:
            break;
        }

        taskDiv.textContent = task.name;
        cell.appendChild(taskDiv);
      }
    }
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = taskForm.taskName.value.trim();
  const dateInput = taskForm.taskDate.value;
  const type = taskForm.taskType.value;
  const description = taskForm.taskDescripition.value.trim();

  if (!name || !dateInput || !type || !description) {
    alert("Preencha todos os campos");
    return;
  }

  const newTask = {
    name,
    date: dateInput,
    type,
    description,
    status: "em desenvolvimento",
  };

  tasks.push(newTask);

  // Re-renderiza o calendário (tarefas)
  renderTasks();

  // Fecha sidebar e reseta form
  taskSidebar.classList.remove("active");
  taskForm.reset();
});

window.renderTasks = renderTasks;
