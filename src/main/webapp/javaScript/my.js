import { fetchTotalItems } from './fetchTotalPlayer.js';
import { changeItemsPerPage } from './pagination.js';
import { fetchData } from './fetchData.js';

let currentPage = 1;
let itemsPerPage = 3;

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();

    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    itemsPerPageSelect.onchange = () => changeItemsPerPage();
    fetchTotalItems(currentPage, itemsPerPage);
//    const createPlayerButton = document.getElementById('createPlayerButton');
//    createPlayerButton.onclick = createPlayer;
});

export function deletePlayer(id) {
    fetch(`/rest/players/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        fetchData(currentPage, itemsPerPage);
        console.log(`delete: ${id}`);
    })
        .catch(error => {
        console.error('Error deleting player:', error);
    });
}

export function editPlayer(id, button) {
    const row = button.closest('tr');
    const editButton = row.querySelector('button.buttonIcon');
    const deleteButton = row.querySelector('button.buttonIconDel');

    if (editButton.getAttribute('data-editing') === 'true') {
        savePlayer(id, row, editButton, deleteButton);
    } else {
        const cells = row.querySelectorAll('td');
        const nameCell = cells[1];
        const titleCell = cells[2];
        const raceCell = cells[3];
        const professionCell = cells[4];
        const bannedCell = cells[7];

        nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
        titleCell.innerHTML = `<input type="text" value="${titleCell.textContent}">`;
        raceCell.innerHTML = `<input type="text" value="${raceCell.textContent}">`;
        professionCell.innerHTML = `<input type="text" value="${professionCell.textContent}">`;
        bannedCell.innerHTML = `<input type="checkbox" ${bannedCell.textContent === 'true' ? 'checked' : ''}>`;

        editButton.querySelector('img').src = '/img/save.png';
        editButton.setAttribute('data-editing', 'true');
        if (deleteButton) {
            deleteButton.style.display = 'none';
        }
    }
}

function savePlayer(id, row, editButton, deleteButton) {
    const cells = row.querySelectorAll('td');
    const nameCell = cells[1];
    const titleCell = cells[2];
    const raceCell = cells[3];
    const professionCell = cells[4];
    const bannedCell = cells[7];

    const updatedPlayer = {
        name: nameCell.querySelector('input').value,
        title: titleCell.querySelector('input').value,
        race: raceCell.querySelector('input').value,
        profession: professionCell.querySelector('input').value,
        banned: bannedCell.querySelector('input').checked
    };

    fetch(`/rest/players/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlayer)
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
        .then(data => {
        fetchData(currentPage, itemsPerPage);
        console.log(`updated: ${id}`);
        editButton.querySelector('img').src = '/img/edit.png';
        editButton.setAttribute('data-editing', 'false');
        if (deleteButton) {
            deleteButton.style.display = 'inline-block';
        }
    })
        .catch(error => {
        console.error('Error updating player:', error);
    });
}

function populateDropdowns() {
    const races = ['HUMAN', 'DWARF', 'ELF', 'GNOME', 'ORC', 'TROLL'];
    const professions = ['WARRIOR', 'ROGUE', 'SORCERER', 'CLERIC', 'PALADIN', 'BARD'];

    const raceSelect = document.getElementById('createRace');
    const professionSelect = document.getElementById('createProfession');

    if (raceSelect && professionSelect) {
        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race;
            option.textContent = race;
            raceSelect.appendChild(option);
        });

        professions.forEach(profession => {
            const option = document.createElement('option');
            option.value = profession;
            option.textContent = profession;
            professionSelect.appendChild(option);
        });
    } else {
        console.error('Race or Profession dropdown not found');
    }
}

function createPlayer() {
    const nameInput = document.getElementById('createName').value.trim();
    const titleInput = document.getElementById('createTitle').value.trim();
    const raceSelect = document.getElementById('createRace').value;
    const professionSelect = document.getElementById('createProfession').value;
    const levelInput = parseInt(document.getElementById('createLevel').value, 10);
    const birthdayInput = document.getElementById('createBirthday').value;
    const bannedCheckbox = document.getElementById('createBanned').checked;

    // ?????????, ??? ???????? ????? ????????????? ??????????
    if (!nameInput || !titleInput || !raceSelect || !professionSelect || !levelInput || !birthdayInput || !bannedCheckbox) {
        console.error('One or more form elements not found');
        return;
    }

    if (nameInput.length === 0 || nameInput.length > 12) {
        alert('Name must be between 1 and 12 characters.');
        return;
    }

    if (titleInput.length === 0 || titleInput.length > 30) {
        alert('Title must be between 1 and 30 characters.');
        return;
    }

    if (isNaN(levelInput) || levelInput < 0 || levelInput > 100) {
        alert('Level must be between 0 and 100.');
        return;
    }

    if (!birthdayInput) {
        alert('Birthday must be a valid date.');
        return;
    }

    const newPlayer = {
        name: nameInput,
        title: titleInput,
        race: raceSelect,
        profession: professionSelect,
        level: levelInput,
        birthday: new Date(birthdayInput).getTime(),
        banned: bannedCheckbox
    };

    console.log('Creating Player:', newPlayer);

    fetch('/rest/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlayer)
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
        .then(data => {
        console.log('Player created successfully:', data);
        // Clearing fields after player creation
        document.getElementById('createName').value = '';
        document.getElementById('createTitle').value = '';
        document.getElementById('createRace').value = '';
        document.getElementById('createProfession').value = '';
        document.getElementById('createLevel').value = '';
        document.getElementById('createBirthday').value = '';
        document.getElementById('createBanned').checked = false;
        // Updating the list of players
        fetchData(currentPage, itemsPerPage);
    })
        .catch(error => {
        console.error('Error creating player:', error);
    });
}

document.getElementById('createPlayerButton').addEventListener('click', createPlayer);
window.deletePlayer = deletePlayer;
window.editPlayer = editPlayer;
