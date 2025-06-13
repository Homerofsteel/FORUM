let isLiked=false;
let isDisliked=false;

const tooglelike = (threadId) => {
    fetch(`/api/thread/${threadId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            isLiked = !isLiked;
            document.getElementById(`like-button-${threadId}`).classList.toggle('liked', isLiked);
            document.getElementById(`like-count-${threadId}`).textContent = data.likes;
        } else {
            console.error('Error liking thread:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}