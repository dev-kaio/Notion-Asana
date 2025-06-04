//Não está sendo usado no momento, talvez não seja necessário

import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, update, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHgBd3FSy4jk6jxQ9TeaKPOlG04exj5Jc",
    authDomain: "notion-asana.firebaseapp.com",
    databaseURL: "https://notion-asana-default-rtdb.firebaseio.com",
    projectId: "notion-asana",
    storageBucket: "notion-asana.firebasestorage.app",
    messagingSenderId: "677053179287",
    appId: "1:677053179287:web:92de0fe05856a74a4f50d2",
    measurementId: "G-WFWKEDQ64K"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { auth, db, update, ref, set, get };
