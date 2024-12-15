// Select elements
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const lineWidthRange = document.getElementById('lineWidth');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const addTextBtn = document.getElementById('addTextBtn');
const templateInput = document.getElementById('templateInput');
const chooseTemplateBtn = document.getElementById('chooseTemplateBtn');
const templateModal = document.getElementById('templateModal');
const closeModal = document.querySelector('.close');
const templates = document.querySelectorAll('.template');

// Set canvas size dynamically
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 600; // Fixed height
}

// Initial settings
let drawing = false;
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = lineWidthRange.value;

// Stack for undo/redo
let undoStack = [];
let redoStack = [];

// Save the current state of the canvas
function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack when a new action happens
}

// Restore the canvas to a given state
function restoreState(stack) {
    if (stack.length > 0) {
        const img = new Image();
        img.src = stack.pop();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Save state on each drawing action
canvas.addEventListener('mouseup', saveState);
canvas.addEventListener('mousemove', () => {
    if (drawing) {
        saveState(); // Save after each stroke
    }
});

// Start drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Update stroke color
colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});

// Update line width
lineWidthRange.addEventListener('input', (e) => {
    ctx.lineWidth = e.target.value;
});

// Clear the canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(); // Save state after clearing
});



// Template Image Selection
templates.forEach((template) => {
    template.addEventListener('click', () => {
        const img = new Image();
        img.src = template.src;
		

        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content
            const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scaleFactor) / 2;
            const y = (canvas.height - img.height * scaleFactor) / 2;

            ctx.drawImage(img, x, y, img.width * scaleFactor, img.height * scaleFactor); // Draw the template image
            saveState(); // Save the state immediately after drawing the template

            templateModal.style.display = 'none'; // Close modal after selecting the template
        };

        img.onerror = function () {
            alert('Error loading the template image. Please try again.');
        };
    });
});

// Add text to canvas
addTextBtn.addEventListener('click', () => {
    const text = prompt('Enter the text you want to add:');
    if (text) {
        canvas.addEventListener('click', function placeText(e) {
            ctx.fillStyle = colorPicker.value;
            ctx.font = `${lineWidthRange.value * 5}px Arial`;
            ctx.fillText(text, e.offsetX, e.offsetY);
            canvas.removeEventListener('click', placeText);
            saveState(); // Save after text is placed
        });
        alert('Click anywhere on the canvas to place the text.');
    }
});

// Open the template modal
chooseTemplateBtn.addEventListener('click', () => {
    templateModal.style.display = 'block';
});

// Close the modal
closeModal.addEventListener('click', () => {
    templateModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === templateModal) {
        templateModal.style.display = 'none';
    }
});

// Undo Button
document.getElementById('undoBtn').addEventListener('click', () => {
    if (undoStack.length > 0) {
        redoStack.push(canvas.toDataURL()); // Save current state to redo stack
        restoreState(undoStack); // Restore last state from undo stack
    }
});

// Redo Button
document.getElementById('redoBtn').addEventListener('click', () => {
    if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL()); // Save current state to undo stack
        restoreState(redoStack); // Restore last state from redo stack
    }
});


// Save canvas as an image
saveBtn.addEventListener('click', () => {
    if (canvas.width > 0 && canvas.height > 0) {
        const link = document.createElement('a');
        link.download = 'JournaList.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link); // Append to DOM (necessary for some browsers)
        link.click();
        document.body.removeChild(link); // Clean up
    } else {
        alert('Nothing to save. Draw something first.');
    }
});