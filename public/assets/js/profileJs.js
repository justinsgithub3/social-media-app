const content = document.querySelector('.main-content');
const greetingHeader = document.getElementById('user-greeting');

async function showUserImages() {
    try {
        const response = await fetch('/api/images/user-images');
        
        if (!response.ok) {
            throw new Error('Failed to load user profile images');
        }

        const data = await response.json();
        const imageList = data.images;

        if (imageList && imageList.length > 0) {
            greetingHeader.innerText = `${imageList[0].username}'s Profile`;
        }

        content.innerHTML = ''; 

        imageList.forEach((thisImage) => {
            const container = document.createElement('div');
            container.classList.add('image-card');

            const imgEle = document.createElement('img');
            imgEle.setAttribute('id', thisImage.id);
            imgEle.setAttribute('width', "10%");
            imgEle.setAttribute('src', thisImage.url);
            imgEle.setAttribute('class', "image");

            const userEl = document.createElement('p');

            container.appendChild(imgEle);
            container.appendChild(userEl);
            content.appendChild(container);
        });
    } catch (e) {
        console.log("Error displaying profile images: " + e);
    }
}

document.addEventListener("DOMContentLoaded", showUserImages);