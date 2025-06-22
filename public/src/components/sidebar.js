// Criar uma verificação de Id Token futuramente
// import { auth } from '../../auth/permissions.js';
import { fetchAndRenderTasks } from "./calendario.js";

export function w3_open() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.style.display = "block";
    sidebar.classList.add("active");
  }
}

export function w3_close() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.style.display = "none";
    sidebar.classList.remove("active");
  }
}

window.w3_open = w3_open;
window.w3_close = w3_close;


const addTaskBtn = document.getElementById("add-task");
const taskSidebar = document.getElementById("taskSidebar");
const closeTaskSidebarBtn = document.getElementById("closeTaskSidebar");
const taskForm = document.getElementById("taskForm");
const saveTaskButton = taskForm
  ? taskForm.querySelector('button[type="submit"]')
  : null;
const taskTitle = document.getElementById("taskTitle");
let editingTaskId = null;

if (addTaskBtn && taskSidebar) {
  addTaskBtn.addEventListener("click", () => {
    editingTaskId = null;
    if (taskForm) taskForm.reset();
    if (saveTaskButton) saveTaskButton.textContent = "Salvar";
    taskSidebar.classList.add("active");
    taskTitle.textContent = "Adicionar Tarefa";
  });
}

if (closeTaskSidebarBtn && taskSidebar) {
  closeTaskSidebarBtn.addEventListener("click", () => {
    taskSidebar.classList.remove("active");
    editingTaskId = null;
    if (taskForm) taskForm.reset();
    if (saveTaskButton) saveTaskButton.textContent = "Salvar";
  });
}

/**
 * @function openTaskFormForEdit
 * @description Abre a sidebar do formulário de tarefas e preenche seus campos
 * com os dados de uma tarefa existente para edição.
 * Esta função é exportada e chamada pelo `calendario.js` quando uma tarefa é clicada.
 * @param {object} taskData - O objeto da tarefa a ser editada (com todos os seus campos, incluindo 'id').
 */
export function openTaskFormForEdit(taskData) {
  if (!taskForm || !taskSidebar || !saveTaskButton) {
    console.error(
      "Elementos do formulário ou sidebar de tarefas não encontrados."
    );
    return;
  }

  editingTaskId = taskData.id; // Define o ID da tarefa que será editada.

  taskForm.responsavel.value = taskData.responsavel || "";
  taskForm.taskName.value = taskData.name || "";
  taskForm.cliente.value = taskData.cliente || "";
  taskForm.taskDate.value = taskData.date || "";
  taskForm.taskType.value = taskData.type || "";
  taskForm.taskDescription.value = taskData.description || "";
  taskTitle.textContent = "Editar Tarefa";
  saveTaskButton.textContent = "Atualizar Tarefa";

  taskSidebar.classList.add("active");
}

if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const responsavel = taskForm.responsavel.value.trim();
    const name = taskForm.taskName.value.trim();
    const cliente = taskForm.cliente.value.trim();
    const dateInput = taskForm.taskDate.value;
    const type = taskForm.taskType.value;
    const description = taskForm.taskDescription.value.trim();
    const dataInsercao = new Date().toISOString();

    if (!responsavel || !name || !cliente || !dateInput || !type || !description) {
      alert("Preencha todos os campos");
      return;
    }
    const taskBE = {
      responsavel,
      name,
      cliente,
      date: dateInput,
      dataInsercao,
      type,
      description,
      status: "em desenvolvimento",
    };

    try {
      let method;
      let url;
      let successMessage;

      //Arrumar após criar "editar tarefa" no backend
      if (editingTaskId) {
        method = "PUT";
        url = `/api/editarTarefa/${editingTaskId}`; // URL com o ID da tarefa para atualização
        successMessage = "Tarefa atualizada com sucesso!";
      } else {
        method = "POST";
        url = "/api/salvarTarefa"; // URL para criação de nova tarefa
        successMessage = "Tarefa adicionada com sucesso!";
        if (taskTitle) taskTitle.textContent = "Adicionar Tarefa";
      }

      let headers = {
        "Content-Type": "application/json",
      };

      //ANALISAR FUTURAMENTE QUANDO TIVER O VERIFYIDTOKEN
      // **CRÍTICO PARA SEGURANÇA:** Anexa o ID Token do usuário logado ao cabeçalho Authorization.
      // Isso é essencial se suas rotas POST e PUT no backend estiverem protegidas pelo `verifyIdToken`.
      // (Você deve descomentar o 'import { auth } from '../../auth/permissions.js';' no início deste arquivo
      // e no `calendario.js`, e também ativar o `verifyIdToken` no seu `server.js`).
      // if (auth.currentUser) {
      //   const idToken = await auth.currentUser.getIdToken();
      //   headers["Authorization"] = `Bearer ${idToken}`;
      // } else {
      //   // Se o usuário não estiver logado, e a rota for protegida, impede a requisição.
      //   alert("Você precisa estar logado para salvar/atualizar tarefas.");
      //   console.error("Usuário não autenticado para salvar/atualizar tarefa.");
      //   return;
      // }

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(taskBE),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Falha na operação: ${errorData.message || response.statusText}`
        );
      }

      console.log(successMessage);
      alert(successMessage);

      await fetchAndRenderTasks();

      if (taskSidebar) taskSidebar.classList.remove("active");
      if (taskForm) taskForm.reset();
      editingTaskId = null;
      if (saveTaskButton) saveTaskButton.textContent = "Salvar";
    } catch (error) {
      console.error("Erro ao enviar tarefa para o backend:", error);
      alert("Ocorreu um erro ao salvar/atualizar a tarefa.");
    }
  });
}