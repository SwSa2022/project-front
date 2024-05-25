import { fetchData } from './fetchData.js';
import { fetchTotalItems } from './fetchTotalPlayer.js';


export function updatePaginationButtons(currentPage, itemsPerPage, totalItems) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const label = document.createElement('label');
    label.textContent = 'Pages: ';
    paginationContainer.appendChild(label);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.onclick = () => {
                fetchData(i, itemsPerPage);
                setActivePageButton(i);
            };

            if (i === currentPage) {
                button.classList.add('active');
            }

            paginationContainer.appendChild(button);
        }
    }
}

function setActivePageButton(activePage) {
    const paginationContainer = document.getElementById('pagination');
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (parseInt(button.textContent) === activePage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

export function changeItemsPerPage() {
    const select = document.getElementById('itemsPerPage');
    const itemsPerPage = parseInt(select.value);
    const currentPage = 1;
    fetchTotalItems(currentPage, itemsPerPage);
}
