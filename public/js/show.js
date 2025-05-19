async function getAllThreads() {
    try {
      const response = await fetch('/api/threads');
      const threads = await response.json();
      console.log("Threads récupérés :", threads);

      const postsContainer = document.querySelector('.posts');
      postsContainer.innerHTML = "";

      threads.forEach(thread => {
        const postHTML = `
          <div class="post">
            <div class="votes">
              <div>▲</div>
              <div>0</div>
              <div>▼</div>
            </div>
            <div class="post-content">
              <h2>${thread.Title}</h2>
              <div class="post-meta">
                Catégorie: ${thread.Category}
              </div>
            </div>
          </div>`;
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
      });

    } catch (err) {
      console.error("Erreur fetch threads:", err);
    }
  }

  async function getAllThreadsIds() {
    try {
      const response = await fetch('/api/threadsids');
      const threads = await response.json();
      console.log("Threads récupérés :", threads);

      const postsContainer = document.querySelector('.posts');
      postsContainer.innerHTML = "";

      threads.forEach(thread => {
        const postHTML = `
              <h2>${thread.Id}</h2>`;
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
      });

    } catch (err) {
      console.error("Erreur fetch threads:", err);
    }
  }