export function renderThreads(threads) {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = "";

  if (threads.length === 0) {
    postsContainer.innerHTML = `<p>Aucun thread trouvé.</p>`;
    return;
  }

  threads.forEach(thread => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.style.cursor = 'pointer';
    postElement.innerHTML = `
      <div class="votes">
        <div>▲</div>
        <div>${thread.Likes}</div>
        <div>▼</div>
      </div>
      <div class="post-content">
        <h2>${thread.Title || 'No Title'}</h2>
        <div class="post-meta">| Catégorie: ${thread.Category || 'No Category'}</div>
        <div class="post-description">${thread.Description || 'No Description'}</div>
      </div>
    `;

    postElement.addEventListener('click', () => {
      window.location.href = `thread.html?id=${thread.ID || thread.Id}`;
    });

    postsContainer.appendChild(postElement);
  });
}

export async function getAllThreads() {
  try {
    const response = await fetch('/api/threads');
    if (!response.ok) throw new Error('Erreur réseau');
    const threads = await response.json();

    renderThreads(threads);
  } catch (err) {
    console.error("Erreur fetch threads:", err);
    throw err;
  }
}

export async function getAllThreadsbyCategory(category) {
  try {
    const response = await fetch(`/api/threadsbycategory/${category}`);
    if (!response.ok) throw new Error('Erreur réseau');

    const threads = await response.json();
    console.log("Threads de la catégorie", category, ":", threads);

    renderThreads(threads);
  } catch (err) {
    console.error("Erreur fetch threads par catégorie:", err);
    document.querySelector('.posts').innerHTML = '<p>Erreur lors du chargement des threads.</p>';
    throw err;
  }
}

export async function getAllThreadsbySort(sort) {
    try {
        const response = await fetch(`/api/threadsbysort/${sort}`);
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Erreur réseau: ${errorData}`);
        }
        const threads = await response.json();
        console.log("Threads triés par", sort, ":", threads);
        return threads;
    } catch (err) {
        console.error("Erreur fetch threads par tri:", err);
        throw err;
    }
}

export async function getThreadById(id) {
    try {
        const response = await fetch(`/api/thread/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load thread');
        }
        
        return data.data;
    } catch (err) {
        console.error("Error fetching thread:", err);
        throw err;
    }
}

export function CreateThread() {
  const form = document.getElementById('threadform');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('Title').value.trim();
    const category = document.getElementById('Category').value;
    const description = document.getElementById('Description').value.trim();

    fetch('../../api/create-thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, description })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = `thread.html?id=${data.id}`;
        } else {
          alert("Erreur lors de la création du thread.");
        }
      })
      .catch(err => {
        console.error("Erreur fetch :", err);
      });
  });
}