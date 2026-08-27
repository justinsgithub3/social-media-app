const content = document.querySelector('.main-content');
const greetingHeader = document.getElementById('user-greeting');

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');

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
            imgEle.setAttribute('src', thisImage.url);
            imgEle.setAttribute('class', "image");

            // Open modal on image click
            imgEle.addEventListener('click', () => {
                if (modal && modalImg) {
                    modalImg.src = thisImage.url;
                    modal.classList.add('open');
                }
            });

            container.appendChild(imgEle);
            content.appendChild(container);
        });
    } catch (e) {
        console.log("Error displaying profile images: " + e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showUserImages();

    // Close modal when clicking anywhere on the overlay
    if (modal) {
        modal.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }
});