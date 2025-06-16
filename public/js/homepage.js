import { getAllThreads, getFilteredThreads, renderThreads, state } from './threadController.js';

document.addEventListener('DOMContentLoaded', async () => {
    const btn = document.getElementById('create-thread-btn');
    const sortSelect = document.querySelector('#Sort');
    const categorySelect = document.querySelector('#Category');

    if (!sortSelect || !categorySelect) {
        console.error('Sort or category select elements not found');
        return;
    }

    if (localStorage.getItem('userLoggedIn') !== 'true') {
        btn.style.display = 'none';
    } else {
        btn.addEventListener('click', () => {
            location.href = '../html/create_thread.html';
        });
    }

    state.currentSort = sortSelect.value || 'Likes';
    state.currentCategory = categorySelect.value;
    console.log('Initial state:', state);

    sortSelect.addEventListener('change', handleFilterChange);
    categorySelect.addEventListener('change', handleFilterChange);

    try {
        await getAllThreads();
    } catch (err) {
        showError('chargement', err);
    }
});

async function handleFilterChange() {
    try {
        const newSort = document.querySelector('#Sort').value;
        const newCategory = document.querySelector('#Category').value;

        if (newSort) state.currentSort = newSort;
        state.currentCategory = newCategory;

        const threads = await getFilteredThreads();
        renderThreads(threads);
    } catch (err) {
        showError('filtrage/tri', err);
    }
}

