// Sidebar da esquerda
window.w3_open = function () {
  document.getElementById("mySidebar").classList.add("active");
};

window.w3_close = function () {
  document.getElementById("mySidebar").classList.remove("active");
};

// Sidebar da direita
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

let tasks = [];

export function renderTasks(currentDate) {
  document.querySelectorAll(".task").forEach((t) => t.remove());

  tasks.forEach((task) => {
    const taskDate = new Date(task.date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
      const day = taskDate.getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const startPadding = (firstDay + 6) % 7;
      const cellIndex = startPadding + day - 1;

      const cell = calendarGrid.children[cellIndex];
      if (cell) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

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
        }

        taskDiv.textContent = task.name;
        cell.appendChild(taskDiv);
      }
    }
  });
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskForm.taskName.value.trim();
  const dateInput = taskForm.taskDate.value;
  const type = taskForm.taskType.value;
  const description = taskForm.taskDescription.value.trim();

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

  try {
    const response = await fetch('/api/GuardarTarefa', { // Envia a tarefa para o backend via POST
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask), // Converte o objeto JavaScript para JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Falha ao adicionar tarefa: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log("Tarefa adicionada com sucesso:", result);
  
    taskSidebar.classList.remove("active"); 
    taskForm.reset();
  }catch (error) {
    console.error("Erro ao enviar tarefa para o backend:", error);
  }

  
});
