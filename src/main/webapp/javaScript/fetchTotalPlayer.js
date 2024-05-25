import { fetchData } from './fetchData.js';
import { updatePaginationButtons } from './pagination.js';

export let totalItems = 0;

export function fetchTotalItems(currentPage, itemsPerPage) {
    fetch('/rest/players/count')
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
        totalItems = data;
        updatePaginationButtons(currentPage, itemsPerPage, totalItems);
        fetchData(currentPage, itemsPerPage);
    })
        .catch(error => {
        console.error('Error fetching total items: ', error);
    });
}

//export function getTotalItems() {
//    return totalItems;
//}
