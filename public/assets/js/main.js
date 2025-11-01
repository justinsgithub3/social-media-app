console.log("in js");

let content = document.querySelector('.main-content');

async function showAllImages() {
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

            content.appendChild(imgEle);
        };
    } catch (e) {
        console.log("Error: " + e);
    }
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
});