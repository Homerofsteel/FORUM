import { getThreadById } from './threadController.js';

async function loadThread() {
  try {
    const params = new URLSearchParams(window.location.search);
    const threadId = params.get('id');

    console.log("ID récupéré de l'URL :", threadId);

    if (!threadId) throw new Error('No thread ID provided');

    const thread = await getThreadById(threadId);
    document.getElementById('thread-title').textContent = thread.Title;
    document.getElementById('thread-category').textContent = thread.Category;
    document.getElementById('thread-description').textContent = thread.Description;
    // document.getElementById('thread-like').textContent = thread.Likes;
    // document.getElementById('thread-dislike').textContent = thread.Dislikes;
    const timestamp = thread.Date;
    const date = new Date(Number(timestamp));
    document.getElementById('thread-date').textContent = date.toDateString();

    console.log('Thread loaded:', thread);
    document.getElementById('thread-container').textContent = '';
  } catch (err) {
    console.error('Error loading thread:', err);
    document.getElementById('thread-container').textContent = 'Error loading thread';
  }
}

window.addEventListener('DOMContentLoaded', loadThread);
