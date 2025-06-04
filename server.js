const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const admin = require('firebase-admin');
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

const db = admin.database(); //Inicializando o Realtime DB

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve arquivos da pasta atual

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/api/GuardarTarefa', async (req, res) => {
    try {
      const novaTarefa = req.body;
  
      if (!novaTarefa.name || !novaTarefa.date || !novaTarefa.type || !novaTarefa.description) {
        return res.status(400).json({ message: "Todos os campos da tarefa são obrigatórios." });
      }
  
      //ORGANIZAR CAMINHO NO DB
      const newRef = db.ref('tasks').push();
      await newRef.set(novaTarefa);
  
      res.status(201).json({ message: "Tarefa salva com sucesso!" });
  
    } catch (error) {
      console.error("Erro ao salvar tarefa no Realtime Database:", error);
      res.status(500).json({ message: "Erro interno do servidor ao salvar tarefa.", error: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
