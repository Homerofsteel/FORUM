export const state = {
  currentSort: 'Likes',
  currentCategory: 'all'
};

const api = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erreur API : ${res.statusText}`);
  const data = await res.json();
  if (data.success === false) throw new Error(data.error || 'Erreur API');
  return data.data ?? data; // data.data si présent, sinon data (liste simple)
};

export function renderThreads(threads) {
  const container = document.querySelector('.posts');
  if (!container) return;

  container.innerHTML = threads.length
    ? threads.map(thread => `
        <div class="post" style="cursor:pointer" data-id="${thread.ID || thread.Id}">
          <div class="votes"><br>${thread.Likes}</div>
          <div>
            <h2>${thread.Title}</h2>
            <div class="post-category">| Catégorie: ${thread.Category}</div>
            <div>${thread.Description}</div>
          </div>
        </div>
      `).join('')
    : `<p>Aucun thread trouvé.</p>`;

  container.querySelectorAll('.post').forEach(post => {
    post.addEventListener('click', () => {
      const id = post.dataset.id;
      if (id) window.location.href = `/html/thread.html?id=${id}`;
    });
  });
}

export const getAllThreads = () => api('/api/threads').then(renderThreads);

export const getThreadById = id => api(`/api/thread/${id}`);

export const getFilteredThreads = () =>
  api(`/api/threads/filter?sort=${state.currentSort}&category=${state.currentCategory}`);

export function CreateThread() {
  const form = document.getElementById('threadform');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.Title.value.trim();
    const category = form.Category.value;
    const description = form.Description.value.trim();

    try {
      const result = await api('/api/create-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description })
      });
      window.location.href = `thread.html?id=${result.id}`;
    } catch (err) {
      console.error('Erreur création thread:', err);
      alert("Erreur lors de la création du thread.");
    }
  });
}
