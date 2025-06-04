import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, update, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDKxLRCY4QO_s1S5HzrkIa84pRh02MOPE",
    authDomain: "projeto-gerenciador-equipes.firebaseapp.com",
    projectId: "projeto-gerenciador-equipes",
    storageBucket: "projeto-gerenciador-equipes.firebasestorage.app",
    messagingSenderId: "1062419358608",
    appId: "1:1062419358608:web:f8fdbe73fae6307e4e4915",
    measurementId: "G-JG807DK0HJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
