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

  } catch (err) {
    console.error('Erreur lors du chargement du thread :', err);
    document.getElementById('thread-container').textContent = 'Erreur lors du chargement du thread.';
  }
});


function setupVoteButtons(threadId) {
  const likeBtn = document.getElementById('like-button');
  const dislikeBtn = document.getElementById('dislike-button');

  likeBtn.addEventListener('click', () => handleVote(threadId, 'like'));
  dislikeBtn.addEventListener('click', () => handleVote(threadId, 'dislike'));

  updateVoteStyle(threadId);
}

function handleVote(threadId, type) {
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
        document.getElementById('like-count').textContent = data.likes;
        document.getElementById('dislike-count').textContent = data.dislikes;
        updateVoteStyle(threadId);
      }
    })
    .catch(console.error);
}

function updateVoteStyle(threadId) {
  const vote = localStorage.getItem(`vote-${threadId}`);
  document.getElementById('like-button').classList.toggle('liked', vote === 'like');
  document.getElementById('dislike-button').classList.toggle('disliked', vote === 'dislike');
}
