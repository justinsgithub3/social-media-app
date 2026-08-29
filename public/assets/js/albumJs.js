let content = document.querySelector('.main-content');
let mainAnchor = document.querySelector('#main-anchor');
const greetingHeader = document.querySelector('#user-greeting');

// Helper function to create a comment DOM element with a delete button if owned by user
function createCommentElement(commentObj, currentUsername) {
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment-item');

    const textSpan = document.createElement('span');
    const commentUser = commentObj.username || 'User';
    textSpan.textContent = `${commentUser}: ${commentObj.comment}`;
    commentEl.appendChild(textSpan);

    // Only add the delete button if a user is logged in and owns the comment
    if (currentUsername && commentUser === currentUsername) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-comment-btn');

        deleteBtn.addEventListener('click', async () => {
            const commentId = commentObj.id || commentObj.comment_id || commentObj.commentId;
            try {
                const res = await fetch(`/api/comments/${commentId}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    commentEl.remove();
                    await showAllImages();
                } else {
                    console.error('Failed to delete comment from server.');
                }
            } catch (err) {
                console.error('Error deleting comment:', err);
            }
        });

        commentEl.appendChild(deleteBtn);
    }

    return commentEl;
}

async function showAllImages() {
    // Read directly from storage
    const rawUsername = sessionStorage.getItem('username');
    const currentUsername = (rawUsername && rawUsername !== 'undefined' && rawUsername !== 'null') ? rawUsername.trim() : null;

    // Strict Header Check: Only set name if valid string exists, otherwise clear text
    if (greetingHeader) {
        if (currentUsername) {
            greetingHeader.textContent = `- ${currentUsername}`;
        } else {
            greetingHeader.textContent = '- not logged in';
        }
    }

    try {
        const [imagesRes, commentsRes] = await Promise.all([
            fetch('/api/images/'),
            fetch('/api/comments/')
        ]);

        const imagesData = await imagesRes.json();
        const commentsData = await commentsRes.json();

        const imageList = imagesData.images || [];
        const allComments = commentsData.comments || [];

        content.innerHTML = ''; 

        for (let i = 0; i < imageList.length; i++) {
            const thisImage = imageList[i]; 

            const container = document.createElement('div');
            container.classList.add('image-card');

            const userEl = document.createElement('p');
            userEl.classList.add('username');

            const userLink = document.createElement('a');
            userLink.classList.add('username-link');
            userLink.textContent = thisImage.username || '';
            userLink.href = `/display/profile?user=${encodeURIComponent(thisImage.username)}`;            userEl.appendChild(userLink);

            const imgEle = document.createElement('img');
            imgEle.setAttribute('id', thisImage.id || i);
            imgEle.setAttribute('src', thisImage.url);
            imgEle.setAttribute('class', "image");

            // --- Comments Section ---
            const commentsSection = document.createElement('div');
            commentsSection.classList.add('comments-section');

            const commentsList = document.createElement('div');
            commentsList.classList.add('comments-list');

            const imageComments = allComments.filter(
                c => c.image_id === thisImage.id || c.imageId === thisImage.id
            );
            
            imageComments.forEach(c => {
                const commentEl = createCommentElement(c, currentUsername);
                commentsList.appendChild(commentEl);
            });

            // Comment input form
            const commentForm = document.createElement('form');
            commentForm.classList.add('comment-form');
            commentForm.innerHTML = `
                <input type="text" placeholder="Add a comment..." required class="comment-input" />
                <button type="submit" class="comment-btn">Post</button>
            `;

            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const commentText = input.value.trim();
                
                if (!commentText) return;

                try {
                    const res = await fetch(`/api/comments/${thisImage.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ comment: commentText })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        const returnedComment = data.comment || {};
                        
                        const newCommentObj = {
                            id: returnedComment.id || returnedComment.comment_id,
                            username: returnedComment.username || currentUsername || 'You',
                            comment: commentText
                        };

                        const newCommentEl = createCommentElement(newCommentObj, currentUsername);
                        commentsList.appendChild(newCommentEl);
                        input.value = '';
                    } else {
                        console.error('Failed to save comment on server.');
                    }
                } catch (err) {
                    console.error('Failed to post comment:', err);
                }
            });

            commentsSection.appendChild(commentsList);
            commentsSection.appendChild(commentForm);

            container.appendChild(userEl);
            container.appendChild(imgEle);
            container.appendChild(commentsSection);
            
            content.appendChild(container);
        }
    } catch (e) {
        console.error("Error loading images:", e);
    }
}

async function handleLogout(e) {
    e.preventDefault();
    
    // Clear DOM state immediately
    if (greetingHeader) {
        greetingHeader.textContent = '';
    }
    
    // Clear all client-side storage explicitly
    sessionStorage.removeItem('username');
    sessionStorage.clear();
    localStorage.clear();

    window.location.href = '/verify/logout';

}

document.addEventListener("DOMContentLoaded", async () => {
    showAllImages();

    const logoutBtn = document.querySelector('#logout-anchor');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});