import { getAllThreads, getAllThreadsbyCategory, getAllThreadsbySort, renderThreads } from './threadController.js';

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('create-thread-btn');
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  if (!isLoggedIn) {
    btn.style.display = 'none';
  } else {
    btn.addEventListener('click', () => {
      window.location.href = '../html/create_thread.html';
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getAllThreads();
  } catch (err) {
    console.error("Erreur lors du chargement des threads:", err);
    document.querySelector('.posts').innerHTML = '<p>Erreur lors du chargement des threads.</p>';
  }

  const categorySelect = document.getElementById("Category");
  categorySelect.addEventListener("change", handleCategoryChange);

  const sortSelect = document.getElementById("Sort");
  sortSelect.addEventListener("change", handleSortChange);
});

async function handleCategoryChange() {
  const selectedCategory = this.value;
  try {
    await getAllThreadsbyCategory(selectedCategory);
  } catch (err) {
    console.error("Erreur lors du chargement des threads par catégorie:", err);
    document.querySelector('.posts').innerHTML = '<p>Erreur lors du chargement des threads.</p>';
  }
}

async function handleSortChange(event) {
    try {
        const selectedSort = event.target.value;
        const threads = await getAllThreadsbySort(selectedSort);
        renderThreads(threads);
    } catch (err) {
        console.error("Erreur lors du chargement des threads par catégorie:", err);
        document.querySelector('.posts').innerHTML = '<p>Erreur lors du chargement des threads.</p>';
    }
}
