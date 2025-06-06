import { auth } from "../src/config/firebaseConfig.js";

import {
  signInWithCustomToken,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

async function login(email, password) {
  try {
    const response = await fetch("api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Falha no login.");
    }

    const { customToken } = responseData;

    if (!customToken) {
      throw new Error("Token de login não recebido.");
    }

    await signInWithCustomToken(auth, customToken);
    console.log("Login bem-sucedido!");
    window.location.href = "./pages/home.html"
    return { success: true };
  } catch (error) {
    console.error("Erro no processo de login:", error);
    return { success: false, message: error.message };
  }
}

async function cadastrarUsuario(email, password) {
  try {
    const response = await fetch('api/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.warn("Resposta não era JSON:", text);
    }

    if (!response.ok) {
      throw new Error(data.message || "Falha no cadastro.");
    }

    const { customToken } = data;

    if (!customToken) {
      throw new Error("Token de cadastro não recebido.");
    }

    await signInWithCustomToken(auth, customToken);
    console.log("Cadastro bem-sucedido! Logando...");
    return { success: true };

  } catch (error) {
    console.error("Erro no processo de cadastro:", error);
    return { success: false, message: error.message };
  }
}


async function logout() {
  try {
    await signOut(auth);
    console.log("Logout realizado com sucesso.");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return { success: false, message: error.message };
  }
}

export { login, cadastrarUsuario, logout };
