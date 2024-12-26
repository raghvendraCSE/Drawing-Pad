const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const eraserBtn = document.getElementById('eraser');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const saveBtn = document.getElementById('save');
const brushShapeEl = document.getElementById('brushShape');

const ctx = canvas.getContext('2d');

let size = 10;
let isPressed = false;
let color = colorEl.value || 'black';
let x, y;
let isEraser = false;
let brushShape = 'circle'; // Default brush shape
let history = []; // Array to store drawing history
let redoHistory = []; // Array to store redo history

// Set the canvas size to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Save the current canvas state to history
function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 10) { // Limit history to last 10 states
        history.shift();
    }
    redoHistory = []; // Clear redo history when a new drawing is made
}

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    x = e.offsetX;
    y = e.offsetY;
    saveState(); // Save state before starting new drawing
});

document.addEventListener('mouseup', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
    if (isPressed) {
        const x2 = e.offsetX;
        const y2 = e.offsetY;

        drawShape(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
});

// Draw shape (circle or square)
function drawShape(x, y) {
    ctx.beginPath();
    if (brushShape === 'circle') {
        ctx.arc(x, y, size, 0, Math.PI * 2);
    } else if (brushShape === 'square') {
        ctx.rect(x - size, y - size, size * 2, size * 2);
    }
    ctx.fillStyle = isEraser ? '#ffffff' : color; // Use white for eraser
    ctx.fill();
}

// Draw line
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isEraser ? '#ffffff' : color; // Use white for eraser
    ctx.lineWidth = size * 2;
    ctx.lineCap = "round"; // Smooth line ends
    ctx.stroke();
}

// Update the size display
function updateSizeOnScreen() {
    sizeEL.innerText = size;
}

// Increase brush size
increaseBtn.addEventListener('click', () => {
    size += 5;
    if (size > 50) {
        size = 50;
    }
    updateSizeOnScreen();
});

// Decrease brush size
decreaseBtn.addEventListener('click', () => {
    size -= 5;
    if (size < 5) {
        size = 5;
    }
    updateSizeOnScreen();
});

// Change color
colorEl.addEventListener('change', (e) => {
    color = e.target.value;
    isEraser = false; // Disable eraser when a new color is selected
    eraserBtn.classList.remove('active');
});

// Clear canvas
clearEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(); // Save the cleared state
});

// Toggle eraser mode
eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    eraserBtn.classList.toggle('active', isEraser);
});

// Undo drawing
undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
        redoHistory.push(canvas.toDataURL()); // Save current state to redo history
        const lastState = history.pop();
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});

// Redo drawing
redoBtn.addEventListener('click', () => {
    if (redoHistory.length > 0) {
        const redoState = redoHistory.pop();
        const img = new Image();
        img.src = redoState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
});

// Save the drawing as an image
saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.png';
    a.click();
});

// Change brush shape (circle or square)
brushShapeEl.addEventListener('change', (e) => {
    brushShape = e.target.value; // Switch between circle and square
});
