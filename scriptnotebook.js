const imageInput = document.getElementById('imageInput');
const book = document.getElementById('book');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const clearBtn = document.getElementById('clearImages');

let images = JSON.parse(localStorage.getItem('savedImages')) || []; // Retrieve images or initialize empty array
let currentPage = 0;

// Function to render book pages
function renderBook() {
    book.innerHTML = ''; // Clear existing pages

    images.forEach((src, index) => {
        const page = document.createElement('div');
        page.className = 'page';
        page.style.zIndex = images.length - index;

        if (index < currentPage) {
            page.style.transform = 'rotateY(-180deg)';
        } else {
            page.style.transform = 'rotateY(0deg)';
        }

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Page ${index + 1}`;

        page.appendChild(img);
        book.appendChild(page);
    });

    localStorage.setItem('savedImages', JSON.stringify(images)); // Save to localStorage
}

// Handle image uploads
imageInput.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                images.push(e.target.result); // Add image source to array
                renderBook();
            };
            reader.readAsDataURL(file);
        });
    }
});

// Navigate to the next page
nextBtn.addEventListener('click', () => {
    if (currentPage < images.length - 1) {
        currentPage++;
        renderBook();
    }
});

// Navigate to the previous page
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderBook();
    }
});

// Clear the current image on the current page
clearBtn.addEventListener('click', () => {
    if (images.length > 0) {
        images.splice(currentPage, 1); // Remove the image at the current page index
        if (currentPage >= images.length) { // If we were on the last page, go back one page
            currentPage = images.length - 1;
        }
        localStorage.setItem('savedImages', JSON.stringify(images)); // Save updated images to localStorage
        renderBook(); // Re-render the book
    }
});

// Initial render on page load
renderBook();
