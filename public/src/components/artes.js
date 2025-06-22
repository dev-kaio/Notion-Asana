import { db } from '../config/firebaseConfig.js';
import {
    ref,
    push,
    set,
    remove,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const teamModal = document.getElementById('teamModal');
const teamForm = document.getElementById('teamForm');
const teamsList = document.getElementById('teamsList');
const searchInput = document.getElementById('searchInput');

const teamName = document.getElementById('teamName');
const teamDescription = document.getElementById('teamDescription');
const avatarCountInput = document.getElementById('avatarCount');

let editTeamId = null;

window.onload = async () => {
    const equipesRef = ref(db, "Equipes/Artes");
    try {
        const snapshot = await get(equipesRef);
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const team = child.val();
                const key = child.key;
                renderTeamCard(team, key);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar equipes:", error);
    }
};

openModalBtn.onclick = () => {
    resetForm();
    teamModal.style.display = 'block';
};

closeModalBtn.onclick = () => {
    teamModal.style.display = 'none';
    resetForm();
};

window.onclick = (event) => {
    if (event.target === teamModal) {
        teamModal.style.display = 'none';
        resetForm();
    }
};

teamForm.onsubmit = async (e) => {
    e.preventDefault();

    const name = teamName.value.trim();
    const description = teamDescription.value.trim();
    const avatarCount = parseInt(avatarCountInput.value) || 3;

    if (!name || !description) return;

    const teamData = {
        nomeDaEquipe: name,
        descricaoEquipe: description,
        quantidadePessoasEquipe: avatarCount
    };

    try {
        const setorPath = "Equipes/Artes";
        if (editTeamId) {
            const teamRef = ref(db, `${setorPath}/${editTeamId}`);
            await update(teamRef, teamData);
            document.querySelector(`[data-id="${editTeamId}"]`)?.closest('.team-card')?.remove();
            renderTeamCard(teamData, editTeamId);
        } else {
            const teamsRef = ref(db, setorPath);
            const newTeamRef = push(teamsRef);
            await set(newTeamRef, teamData);
            renderTeamCard(teamData, newTeamRef.key);
        }

        resetForm();
        teamModal.style.display = 'none';
    } catch (error) {
        console.error("Erro ao salvar equipe:", error);
    }
};

function renderTeamCard(team, key) {
    const card = document.createElement('div');
    card.className = 'team-card';

    const avatars = Array.from({ length: team.quantidadePessoasEquipe }, () => {
        const avatarIndex = Math.floor(Math.random() * 70) + 1;
        return `<img src="https://i.pravatar.cc/100?img=${avatarIndex}" />`;
    }).join('');

    card.innerHTML = `
        <h3>${team.nomeDaEquipe}</h3>
        <div class="team-members">${avatars}</div>
        <p class="team-description">${team.descricaoEquipe}</p>
        <div class="card-actions">
            <button class="action-btn edit-btn" data-id="${key}"><i class="fa fa-pencil"></i> Editar</button>
            <button class="action-btn delete-btn" data-id="${key}"><i class="fa fa-trash"></i> Excluir</button>
        </div>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => deleteTeam(key, card));
    card.querySelector('.edit-btn').addEventListener('click', () => editTeam(key, team));

    teamsList.appendChild(card);
}

function deleteTeam(teamId, cardElement) {
    const teamRef = ref(db, "Equipes/Atendimento/" + teamId);
    remove(teamRef)
        .then(() => {
            teamsList.removeChild(cardElement);
        })
        .catch(error => {
            console.error("Erro ao excluir equipe:", error);
        });
}

function editTeam(teamId, team) {
    teamName.value = team.nomeDaEquipe;
    teamDescription.value = team.descricaoEquipe;
    avatarCountInput.value = team.quantidadePessoasEquipe;
    editTeamId = teamId;
    teamModal.style.display = 'block';
}

function resetForm() {
    teamForm.reset();
    editTeamId = null;
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.team-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});
