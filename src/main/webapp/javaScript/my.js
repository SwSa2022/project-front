import { fetchTotalItems } from './fetchTotalPlayer.js';
import { changeItemsPerPage } from './pagination.js';
import { fetchData } from './fetchData.js';

let currentPage = 1;
let itemsPerPage = 3;

document.addEventListener('DOMContentLoaded', () => {
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    itemsPerPageSelect.onchange = () => changeItemsPerPage();
    fetchTotalItems(currentPage, itemsPerPage);
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
        // Edit functionality
        const cells = row.querySelectorAll('td');
        const nameCell = cells[1];
        const titleCell = cells[2];
        const raceCell = cells[3];
        const professionCell = cells[4];
        const bannedCell = cells[7];

        // Convert text content to input fields
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
        name: nameCell.querySelector('input').value.trim(),
        title: titleCell.querySelector('input').value.trim(),
        race: raceCell.querySelector('input').value.trim(),
        profession: professionCell.querySelector('input').value.trim(),
        banned: bannedCell.querySelector('input').checked
    };

    console.log('Updated Player:', updatedPlayer);

    fetch(`/rest/players/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlayer)
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ${errorData.message}');
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
window.deletePlayer = deletePlayer;
window.editPlayer = editPlayer;

