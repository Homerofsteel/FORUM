import { getThreadById } from './threadController.js';

document.addEventListener('DOMContentLoaded', async () => {
  const threadId = new URLSearchParams(window.location.search).get('id');

  if (!threadId) {
    document.getElementById('thread-container').textContent = 'Thread ID manquant.';
    return;
  }

  try {
    const thread = await getThreadById(threadId);

    document.getElementById('thread-title').textContent = thread.Title;
    document.getElementById('thread-category').textContent = thread.Category;
    document.getElementById('thread-description').textContent = thread.Description;
    document.getElementById('like-count').textContent = thread.Likes;
    document.getElementById('dislike-count').textContent = thread.Dislikes;

    const date = new Date(Number(thread.Date));
    document.getElementById('thread-date').textContent = date.toDateString();

    setupVoteButtons(threadId);
    await loadComments(threadId);
    setupCommentForm(threadId);

  } catch (err) {
    console.error('Erreur lors du chargement du thread :', err);
    document.getElementById('thread-container').textContent = 'Erreur lors du chargement du thread.';
  }
});

function setupVoteButtons(thread_id) {
  const likeBtn = document.getElementById('like-button');
  const dislikeBtn = document.getElementById('dislike-button');

  likeBtn.addEventListener('click', () => handleVote(thread_id, 'like'));
  dislikeBtn.addEventListener('click', () => handleVote(thread_id, 'dislike'));

  updateVoteStyle(thread_id);
}

function handleVote(thread_id, type) {
  const key = `vote-${thread_id}`;
  const current = localStorage.getItem(key);
  let action;

  if (current === type) {
    action = type === 'like' ? 'remove-like' : 'remove-dislike';
    localStorage.removeItem(key);
  } else {
    action = current ? `switch-to-${type}` : type;
    localStorage.setItem(key, type);
  }

  fetch(`/api/thread/${thread_id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('like-count').textContent = data.likes;
        document.getElementById('dislike-count').textContent = data.dislikes;
        updateVoteStyle(thread_id);
      }
    })
    .catch(console.error);
}

function updateVoteStyle(thread_id) {
  const vote = localStorage.getItem(`vote-${threadId}`);
  document.getElementById('like-button').classList.toggle('liked', vote === 'like');
  document.getElementById('dislike-button').classList.toggle('disliked', vote === 'dislike');
}

async function loadComments(threadId) {
    try {
        const response = await fetch(`/api/thread/${threadId}/comments`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('comments-container');
            container.innerHTML = data.comments.map(comment => `
                <div class="comment">
                    <div class="comment-meta">
                        <strong>${comment.username}</strong> • ${new Date(comment.created_at).toLocaleDateString()}
                    </div>
                    <div class="comment-content">
                        ${comment.content}
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading comments:', err);
    }
}

function setupCommentForm(thread_id) {
    const form = document.getElementById('comment-form');
    if (!form) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
        form.innerHTML = '<p>Veuillez <a href="/public/html/login.html">vous connecter</a> pour commenter</p>';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('comment-content').value;
        
        try {
            const response = await fetch(`/api/thread/${thread_id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();
            if (data.success) {
                document.getElementById('comment-content').value = '';
                loadComments(thread_id); // Refresh
            }
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    });
}
