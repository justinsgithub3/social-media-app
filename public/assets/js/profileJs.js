const content = document.querySelector('.main-content');
const greetingHeader = document.getElementById('user-greeting');

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');

async function showUserImages() {
    try {
        // 1. Check if a specific user was requested in the URL query string
        const urlParams = new URLSearchParams(window.location.search);
        const targetUsername = urlParams.get('user');

        // 2. Decide endpoint: use public username route if ?user= exists, otherwise fallback to logged-in user endpoint
        const endpoint = targetUsername 
            ? `/api/images/user/${encodeURIComponent(targetUsername)}`
            : '/api/images/user-images';

        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error('Failed to load user profile images');
        }

        const data = await response.json();
        // Support array response or object wrapper { images: [...] }
        const imageList = data.images || data;

        // Set heading: use URL parameter first, then image data username, or a default fallback
        if (greetingHeader) {
            if (targetUsername) {
                greetingHeader.innerText = `${targetUsername}'s Profile`;
            } else if (imageList && imageList.length > 0 && imageList[0].username) {
                greetingHeader.innerText = `${imageList[0].username}'s Profile`;
            } else {
                greetingHeader.innerText = 'My Profile';
            }
        }

        content.innerHTML = ''; 

        if (!imageList || imageList.length === 0) {
            content.innerHTML = '<p>No images found.</p>';
            return;
        }

        imageList.forEach((thisImage, index) => {
            const container = document.createElement('div');
            container.classList.add('image-card');

            const imgEle = document.createElement('img');
            imgEle.setAttribute('id', thisImage.id || index);
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
        console.error("Error displaying profile images: " + e);
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