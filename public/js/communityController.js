import { getThreadById } from "./threadController.js";

async function getCurrentUserId() {
      return 1; // temporaire
    }

   export async function loadThread() {
      const threadId = new URLSearchParams(window.location.search).get("id");
      const thread = await getThreadById(threadId);

      document.getElementById("thread-title").textContent = thread.Title;
      document.getElementById("thread-category").textContent = thread.Category;
      document.getElementById("thread-description").textContent = thread.Description;
      document.getElementById("thread-date").textContent = new Date(Number(thread.Date)).toDateString();

      await loadComments(threadId);
    }

    async function loadComments(threadId) {
      const res = await fetch(`/api/comments/${threadId}`);
      const comments = await res.json();
      const container = document.getElementById("comments-container");
      container.innerHTML = "";
      const tree = renderComments(comments);
      container.appendChild(tree);

      document.querySelectorAll(".reply-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          document.getElementById(`reply-form-${id}`).style.display = "block";
        });
      });

      attachReportHandlers();
    }

    function renderComments(comments, parentId = null) {
      const container = document.createElement("div");
      comments.filter((c) => c.parent_id === parentId).forEach((comment) => {
        const div = document.createElement("div");
        div.style.marginLeft = parentId ? "20px" : "0";
        div.innerHTML = `
          <p><strong>${comment.username}</strong>: ${comment.content}</p>
          <button class="reply-btn" data-id="${comment.id}">Répondre</button>
          <button class="report-btn" data-id="${comment.id}">Signaler</button>
          <div class="report-form" id="report-form-${comment.id}" style="display:none;">
            <textarea id="report-text-${comment.id}" placeholder="Pourquoi ce signalement ?"></textarea>
            <button onclick="submitReport(${comment.id})">Envoyer le signalement</button>
          </div>
          <div class="reply-form" id="reply-form-${comment.id}" style="display:none;">
            <textarea id="reply-text-${comment.id}" placeholder="Votre réponse..."></textarea>
            <button onclick="submitReply(${comment.id})">Envoyer</button>
          </div>
        `;
        div.appendChild(renderComments(comments, comment.id));
        container.appendChild(div);
      });
      return container;
    }

    window.submitReply = async function (parentId) {
      const threadId = new URLSearchParams(window.location.search).get("id");
      const content = document.getElementById(`reply-text-${parentId}`).value;
      const userId = await getCurrentUserId();

      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          user_id: userId,
          content,
          parent_id: parentId,
        }),
      });

      await loadComments(threadId);
    };

    document.getElementById("submit-comment").addEventListener("click", async () => {
      const threadId = new URLSearchParams(window.location.search).get("id");
      const content = document.getElementById("comment-content").value;
      const userId = await getCurrentUserId();

      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          user_id: userId,
          content,
        }),
      });

      document.getElementById("comment-content").value = "";
      await loadComments(threadId);
    });

    window.submitReport = async function (commentId) {
      const reason = document.getElementById(`report-text-${commentId}`).value;
      const userId = await getCurrentUserId();

      if (!reason.trim()) return alert("Merci d'expliquer la raison du signalement.");

      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment",
          reported_id: commentId,
          reason,
          user_id: userId,
        }),
      });

      alert("Signalement envoyé !");
      document.getElementById(`report-form-${commentId}`).style.display = "none";
    };

    function attachReportHandlers() {
      document.querySelectorAll(".report-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          const form = document.getElementById(`report-form-${id}`);
          if (form) form.style.display = "block";
        });
      });
    }

    window.addEventListener("DOMContentLoaded", loadThread);