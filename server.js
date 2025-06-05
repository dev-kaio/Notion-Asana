const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const databaseURL = process.env.FIREBASE_DATABASE_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

const db = admin.database();
const authAdmin = admin.auth();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//Cadastrando usuário
app.post("/api/registrar", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha obrigatórios." });
  }

  try {
    const userAuth = await authAdmin.createUser({
      email: email,
      senha: password,
    });
    console.log("Usuário criado com UID: ", userAuth.uid);

    const customToken = await authAdmin.createCustomToken(userAuth.uid);
    res.status(201).json({
      customToken: customToken,
      message: "Usuário cadastrado e token gerado.",
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário: ", error.message);
    let errorMessage = "Erro ao cadastrar usuário.";
    if (error.code === "auth/email-already-exists") {
      errorMessage = "Email já está em uso.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "A senha é muito fraca (mínimo de 6 caracteres).";
    }
    res.status(400).json({ message: errorMessage, error: error.message });
  }
});

//Logando usuário (Não terminei)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password){
    return res.status(400).json({ message: "Email e senha obrigatórios. "});
  }

  try{

  }
})

//Salvar tarefas no Realtime DB
