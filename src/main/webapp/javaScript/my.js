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
    const deleteButton = row.querySelector('button.buttonIcon + button.buttonIconDel');

    if (editButton.getAttribute('data-editing') === 'true') {
        console.log(`Save player with id: ${id}`);
        editButton.querySelector('img').src = '/img/edit.png';
        editButton.setAttribute('data-editing', 'false');
        deleteButton.style.display = 'inline-block';
    } else {
        console.log(`Edit player with id: ${id}`);
        editButton.querySelector('img').src = '/img/save.png';
        editButton.setAttribute('data-editing', 'true');
        deleteButton.style.display = 'none';
    }
}

window.deletePlayer = deletePlayer;
window.editPlayer = editPlayer;

//let currentPage = 1;
//let itemsPerPage = 3;
//let totalItems = 0;

//function fetchTotalItems() {
//    fetch('/rest/players/count')
//        .then(response => {
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }
//        return response.json();
//    })
//        .then(data => {
//        totalItems = data;
//        updatePaginationButtons();
//        fetchData(currentPage, itemsPerPage);
//    })
//        .catch(error => {
//        console.error('Error fetching total items: ', error);
//    });
//}

//function fetchData(page = 1) {
//    fetch(`/rest/players?pageNumber=${page - 1}&pageSize=${itemsPerPage}`)
//        .then(response => {
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }
//        return response.json();
//    })
//        .then(data => {
//        const tableBody = document.querySelector('#getListPlayers tbody');
//        tableBody.innerHTML = '';
//
//        data.forEach(player => {
//            const row = `
//                    <tr>
//                        <td>${player.id}</td>
//                        <td>${player.name}</td>
//                        <td>${player.title}</td>
//                        <td>${player.race}</td>
//                        <td>${player.profession}</td>
//                        <td>${player.level}</td>
//                        <td>${new Date(player.birthday).toLocaleDateString()}</td>
//                        <td>${player.banned}</td>
//                        <td class="button-cell"><button class="buttonIcon" onclick="editPlayer(${player.id}, this)"><img src="/img/edit.png" alt="Edit"></button></td>
//                        <td class="button-cell"><button class="buttonIconDel" onclick="deletePlayer(${player.id})"><img src="/img/delete.png" alt="Delete"></button></td>
//                    </tr>
//                `;
//            tableBody.insertAdjacentHTML('beforeend', row);
//        });
//        updatePaginationButtons();
//    })
//        .catch(error => {
//        console.error('Error receiving data: ', error);
//    });
//}

//function updatePaginationButtons() {
//    const paginationContainer = document.getElementById('pagination');
//    paginationContainer.innerHTML = '';
//
//    const label = document.createElement('label');
//    label.textContent = 'Pages: ';
//    paginationContainer.appendChild(label);
//
//    const totalPages = Math.ceil(totalItems / itemsPerPage);
//    if (totalPages > 1) {
//        for (let i = 1; i <= totalPages; i++) {
//            const button = document.createElement('button');
//            button.textContent = i;
//            button.onclick = () => {
//                currentPage = i;
//                fetchData(currentPage, itemsPerPage);
//                setActivePageButton(i);
//            };
//
//            if (i === currentPage) {
//                button.classList.add('active');
//            }
//
//            paginationContainer.appendChild(button);
//        }
//    }
//}

//function setActivePageButton(activePage) {
//    const paginationContainer = document.getElementById('pagination');
//    const buttons = paginationContainer.querySelectorAll('button');
//    buttons.forEach(button => {
//        if (parseInt(button.textContent) === activePage) {
//            button.classList.add('active');
//        } else {
//            button.classList.remove('active');
//        }
//    });
//}
//
//function changeItemsPerPage() {
//    const select = document.getElementById('itemsPerPage');
//    itemsPerPage = parseInt(select.value);
//    currentPage = 1;
//    fetchTotalItems();
//}


