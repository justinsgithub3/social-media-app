let content = document.querySelector('.main-content');
let mainAnchor = document.querySelector('#main-anchor');
    const logoutBtn = document.querySelector('#logout-anchor');

async function showAllImages() {
    try {
        const response = await fetch('/api/images/');
        const data = await response.json();
        const numberOfImages = data.images.length;
        const imageList = data.images; 

        content.innerHTML = '';

        for (let i = 0; i < numberOfImages; i++) {
            let thisImage = imageList[i]; 

            // Card container
            const container = document.createElement('div');
            container.classList.add('image-card');

            // Username header
            const userEl = document.createElement('p');
            userEl.classList.add('username');
            userEl.innerText = thisImage.username;

            // Image
            const imgEle = document.createElement('img');
            imgEle.setAttribute('id', thisImage.id || i);
            imgEle.setAttribute('src', thisImage.url);
            imgEle.setAttribute('class', "image");

            // --- Comments Section ---
            const commentsSection = document.createElement('div');
            commentsSection.classList.add('comments-section');

            // List container to render existing comments
            const commentsList = document.createElement('div');
            commentsList.classList.add('comments-list');
            
            // Loop through existing comments if backend provides them
            if (thisImage.comments && Array.isArray(thisImage.comments)) {
                thisImage.comments.forEach(c => {
                    const commentEl = document.createElement('p');
                    commentEl.classList.add('comment-item');
                    commentEl.innerHTML = `<strong>${c.username}:</strong> ${c.comment}`;
                    commentsList.appendChild(commentEl);
                });
            }

            // Comment Input Form
            const commentForm = document.createElement('form');
            commentForm.classList.add('comment-form');
            commentForm.innerHTML = `
                <input type="text" placeholder="Add a comment..." required class="comment-input" />
                <button type="submit" class="comment-btn">Post</button>
            `;

            // Handle Comment Submission
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const commentText = input.value.trim();
                
                if (!commentText) return;

                try {
                    const res = await fetch('/api/comments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image_id: thisImage.id,
                            comment: commentText
                        })
                    });

                    if (res.ok) {
                        const newComment = document.createElement('p');
                        newComment.classList.add('comment-item');
                        newComment.innerHTML = `<strong>You:</strong> ${commentText}`;
                        commentsList.appendChild(newComment);
                        input.value = '';
                    }
                } catch (err) {
                    console.error('Failed to post comment:', err);
                }
            });

            // Build hierarchy
            commentsSection.appendChild(commentsList);
            commentsSection.appendChild(commentForm);

            container.appendChild(userEl);
            container.appendChild(imgEle);
            container.appendChild(commentsSection);
            
            content.appendChild(container);
        }
    } catch (e) {
        console.log("Error: " + e);
    }
    /*
    try {
        const response = await fetch('/api/images/');
        const data = await response.json();
        const numberOfImages = data.length; // number of images in array
        const imageUrl = data.images; // array of image urls
        // loop over each image url and add it to an img element in the content section
        for (let i = 0; i < numberOfImages; i++) {
            let thisImage = imageUrl[i]; // specific image url to work with
            const imgEle = document.createElement('img');
            imgEle.setAttribute('id', i);
            imgEle.setAttribute('width', "10%");
            imgEle.setAttribute('src', thisImage);
            imgEle.setAttribute('class', "image")

            // only have 1 of the 2 block below execute!

            // adds image as last image
            content.appendChild(imgEle);

            // adds image as first image
            //content.insertBefore(imgEle, content.firstChild);
        };
    } catch (e) {
        console.log("Error: " + e);
    }
    */
}

async function handleLogout(e) {
    e.preventDefault();
    
    sessionStorage.clear(); 
}

async function showPosts() {
    
    try {
        const res = await fetch('http://localhost:8080/api/posts');
        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }
        const posts = await res.json();
        imgEle.innerHTML = '';

        posts[0].forEach((post => {
           
            const id = post.category_id;
            const title = post.category_name;

            const postEl = document.createElement('div');
            postEl.setAttribute("id", id);
            imgEle.appendChild(postEl);
        
            const spanEl = document.createElement('span');
            spanEl.innerText = title;
            postEl.appendChild(spanEl);

            // create delete button
            const deleteEl = document.createElement('button');
            deleteEl.textContent = 'x';
            deleteEl.classList.add('delete');
            deleteEl.addEventListener('click', deletePost); // event listener attached to every delete button
            postEl.appendChild(deleteEl);

            // create edit button
            const editEl = document.createElement('button');
            editEl.textContent = 'edit';
            editEl.classList.add('edit')
            editEl.addEventListener('click', editPost); // event listener attached to every edit button
            postEl.appendChild(editEl);
        }))
    } catch (error) {
        console.log('Error fetching posts: ', error)
    }
}

// submit new post
async function addPost(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const title = formData.get('title');

    try {
        const res = await fetch('http://localhost:8080/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({title})
        })

        if (!res.ok) {
            throw new Error('Failed to add post')
        }

        const newPost = await res.json();
        const postEl = document.createElement('div');
        postEl.textContent = newPost.title;
        imgEle.appendChild(postEl);

        // updates current display
        showPosts();
        
    } catch (error) {
        console.log('Error adding post')
    }
}

// this function is attached to an event listener on delete
async function deletePost(e) {
    e.preventDefault();
    // get element id of parent element of event element which is delete button
    const id = e.srcElement.parentNode.id;

    try {
        const res = await fetch('http://localhost:8080/api/posts/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            throw new Error("Failed to fetch desired post");
        }

        // updates current display
        showPosts();

    } catch (error) {
        console.log('Error deleting post: ', error)
    }
}

async function editPost(e) {
    e.preventDefault();
    // get element id of parent element of event element which is delete button
    const id = e.srcElement.parentNode.id;

    // parent node
    const parentEl = e.srcElement.parentNode;

    // convert span element to input element
    const spanEl = e.srcElement.parentNode.firstChild;
    const spanText = spanEl.innerText;
    
    const inputEl = document.createElement('input');

    inputEl.classList.add('new-title')
    inputEl.setAttribute("id", id);
    inputEl.value = spanText;

    // add input El as first in div
    parentEl.insertBefore(inputEl, spanEl);
    
    // remove the span
    spanEl.remove();

    const editButton = document.getElementById(id).getElementsByClassName('edit')[0];
    editButton.textContent = 'save';
    editButton.classList.add('save');
    editButton.classList.remove('edit');

    // make the button listen for a 'save' click.
    editButton.removeEventListener('click', editPost);
    editButton.addEventListener('click', saveEdit);
}

// if save button is clicked ******
async function saveEdit(e) {
    const id = e.srcElement.parentNode.id;
    const newTitle = document.getElementById(id).getElementsByClassName('new-title')[0].value;

    try {
        const res = await fetch('http://localhost:8080/api/posts/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': id, 'newTitle': newTitle})
        });
        if (!res.ok) {
            throw new Error("Failed to fetch desired post");
        }

        // updates current display
        showPosts();

    } catch (error) {
        console.log('Error deleting post: ', error)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // initial render goes to album
    showAllImages();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});