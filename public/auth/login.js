import { login, cadastrarUsuario } from "./permissions.js";

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const result = await login(email, password);

  if (result.success) {
    window.location.href = "./pages/home.html";
  } else {
    loginError.textContent = "Erro: " + result.message;
  }
});

signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const result = await cadastrarUsuario(email, password);

  if (result.success) {
    signupError.textContent = "Usuário criado com sucesso! Agora faça login.";
  } else {
    signupError.textContent = "Erro: " + result.message;
  }
});
