export const state = {
  currentSort: 'Likes',
  currentCategory: 'all'
};

async function api(url, options = {}) {
  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.error || 'Erreur API');
  }

  return result.data || result;
}

export function renderThreads(threads) {
  const container = document.querySelector('.posts');
  if (!container) return;

  if (!threads.length) {
    container.innerHTML = `<p>Aucun thread trouvé.</p>`;
    return;
  }

  container.innerHTML = threads.map(thread => `
    <div class="post" data-id="${thread.ID || thread.Id}" style="cursor:pointer">
      <div class="votes"><br>${thread.Likes}</div>
      <div>
        <h2>${thread.Title}</h2>
        <p>Catégorie : ${thread.Category}</p>
        <p>${thread.Description}</p>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.post').forEach(post => {
    post.addEventListener('click', () => {
      const id = post.dataset.id;
      if (id) window.location.href = `/html/thread.html?id=${id}`;
    });
  });
}

export function getAllThreads() {
  api('/api/threads')
    .then(renderThreads)
    .catch(err => console.error('Erreur chargement threads :', err));
}

export function getThreadById(id) {
  return api(`/api/thread/${id}`);
}

export function getFilteredThreads() {
  const { currentSort, currentCategory } = state;
  return api(`/api/threads/filter?sort=${currentSort}&category=${currentCategory}`);
}

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
      console.error('Erreur création thread :', err);
      alert("Erreur lors de la création du thread.");
    }
  });
}

export function vote(threadId, type) {
  const key = `vote-${threadId}`;
  const current = localStorage.getItem(key);

  let action;
  if (current === type) {
    action = type === 'like' ? 'remove-like' : 'remove-dislike';
    localStorage.removeItem(key);
  } else {
    action = current ? `switch-to-${type}` : type;
    localStorage.setItem(key, type);
  }

  fetch(`/api/thread/${threadId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const like = document.getElementById(`like-count-${threadId}`);
        const dislike = document.getElementById(`dislike-count-${threadId}`);
        if (like) like.textContent = data.likes;
        if (dislike) dislike.textContent = data.dislikes;

        updateVoteButtons(threadId);
      }
    })
    .catch(err => console.error('Erreur lors du vote :', err));
}

function updateVoteButtons(threadId) {
  const vote = localStorage.getItem(`vote-${threadId}`);
  const likeBtn = document.getElementById(`like-button-${threadId}`);
  const dislikeBtn = document.getElementById(`dislike-button-${threadId}`);

  if (likeBtn) likeBtn.classList.toggle('liked', vote === 'like');
  if (dislikeBtn) dislikeBtn.classList.toggle('disliked', vote === 'dislike');
}
