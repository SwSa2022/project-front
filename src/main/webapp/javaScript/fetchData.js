import { updatePaginationButtons } from './pagination.js';
import { totalItems } from './fetchTotalPlayer.js';
import { editPlayer, deletePlayer } from './my.js';

export function fetchData(page = 1, itemsPerPage = 3) {
    fetch(`/rest/players?pageNumber=${page - 1}&pageSize=${itemsPerPage}`)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
        const tableBody = document.querySelector('#getListPlayers tbody');
        tableBody.innerHTML = '';

        data.forEach(player => {
            const row = `
                    <tr>
                        <td>${player.id}</td>
                        <td>${player.name}</td>
                        <td>${player.title}</td>
                        <td>${player.race}</td>
                        <td>${player.profession}</td>
                        <td>${player.level}</td>
                        <td>${new Date(player.birthday).toLocaleDateString()}</td>
                        <td>${player.banned}</td>
                        <td class="button-cell"><button class="buttonIcon" onclick="editPlayer(${player.id}, this)"><img src="/img/edit.png" alt="Edit"></button></td>
                        <td class="button-cell"><button class="buttonIconDel" onclick="deletePlayer(${player.id})"><img src="/img/delete.png" alt="Delete"></button></td>
                    </tr>
                `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
        updatePaginationButtons(page, itemsPerPage, totalItems);
    })
        .catch(error => {
        console.error('Error receiving data: ', error);
    });
}
