const defaultColors = [
  "#1b1b1a",
  "#ffffff",
  "#e06c75",
  "#98c379",
  "#e5c07b",
  "#61afef",
  "#c678dd",
  "#56b6c2"
];
let paletteColors = [...defaultColors];
let currentColor = paletteColors[0];
let currentTool = "pencil";
let gridSize = 12;
let isDrawing = false;
const gridSizeSelect = document.getElementById("grid-size");
const pixelGrid = document.getElementById("pixel-grid");
const paletteContainer = document.getElementById("palette");
const toolPencil = document.getElementById("tool-pencil");
const toolEraser = document.getElementById("tool-eraser");
const toolFill = document.getElementById("tool-fill");
const customColorInput = document.getElementById("custom-color");
const addColorBtn = document.getElementById("add-color");
const actionClear = document.getElementById("action-clear");
const actionExport = document.getElementById("action-export");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const exportOutput = document.getElementById("export-output");
function initPalette() {
  paletteContainer.innerHTML = "";
  paletteColors.forEach((color, index) => {
    const swatch = document.createElement("button");
    swatch.className = "palette-swatch";
    if (color === currentColor) {
      swatch.classList.add("selected");
    }
    swatch.style.backgroundColor = color;
    swatch.addEventListener("click", () => {
      currentColor = color;
      currentTool = "pencil";
      updateToolUI();
      initPalette();
    });
    paletteContainer.appendChild(swatch);
  });
}
function initGrid() {
  pixelGrid.innerHTML = "";
  pixelGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  pixelGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  const totalPixels = gridSize * gridSize;
  for (let i = 0; i < totalPixels; i++) {
    const pixel = document.createElement("button");
    pixel.className = "pixel";
    pixel.dataset.index = i;
    pixel.addEventListener("mousedown", (e) => {
      isDrawing = true;
      handlePixelAction(pixel);
    });
    pixel.addEventListener("mouseenter", () => {
      if (isDrawing) {
        handlePixelAction(pixel);
      }
    });
    pixelGrid.appendChild(pixel);
  }
}
function handlePixelAction(pixel) {
  if (currentTool === "pencil") {
    pixel.style.backgroundColor = currentColor;
  } else if (currentTool === "eraser") {
    pixel.style.backgroundColor = "";
  } else if (currentTool === "fill") {
    floodFill(pixel);
  }
}
function floodFill(startPixel) {
  const targetColor = startPixel.style.backgroundColor || "";
  const fillColor = currentColor;
  if (targetColor === fillColor) return;
  const pixels = Array.from(pixelGrid.children);
  const startIndex = parseInt(startPixel.dataset.index);
  const queue = [startIndex];
  const visited = new Set();
  while (queue.length > 0) {
    const currentIndex = queue.shift();
    if (visited.has(currentIndex)) continue;
    visited.add(currentIndex);
    const p = pixels[currentIndex];
    const pColor = p.style.backgroundColor || "";
    if (pColor === targetColor) {
      p.style.backgroundColor = fillColor;
      const x = currentIndex % gridSize;
      const y = Math.floor(currentIndex / gridSize);
      if (x > 0) queue.push(currentIndex - 1);
      if (x < gridSize - 1) queue.push(currentIndex + 1);
      if (y > 0) queue.push(currentIndex - gridSize);
      if (y < gridSize - 1) queue.push(currentIndex + gridSize);
    }
  }
}
function updateToolUI() {
  toolPencil.classList.remove("active");
  toolEraser.classList.remove("active");
  toolFill.classList.remove("active");
  if (currentTool === "pencil") toolPencil.classList.add("active");
  if (currentTool === "eraser") toolEraser.classList.add("active");
  if (currentTool === "fill") toolFill.classList.add("active");
}
window.addEventListener("mouseup", () => {
  isDrawing = false;
});
gridSizeSelect.addEventListener("change", (e) => {
  gridSize = parseInt(e.target.value);
  initGrid();
});
toolPencil.addEventListener("click", () => {
  currentTool = "pencil";
  updateToolUI();
});
toolEraser.addEventListener("click", () => {
  currentTool = "eraser";
  updateToolUI();
});
toolFill.addEventListener("click", () => {
  currentTool = "fill";
  updateToolUI();
});
addColorBtn.addEventListener("click", () => {
  const newColor = customColorInput.value;
  if (!paletteColors.includes(newColor)) {
    paletteColors.push(newColor);
    currentColor = newColor;
    initPalette();
  }
});
actionClear.addEventListener("click", () => {
  const pixels = pixelGrid.children;
  Array.from(pixels).forEach(p => {
    p.style.backgroundColor = "";
  });
});
actionExport.addEventListener("click", () => {
  const pixels = Array.from(pixelGrid.children);
  const data = pixels.map(p => p.style.backgroundColor || "transparent");
  const exportData = {
    size: gridSize,
    pixels: data
  };
  exportOutput.value = JSON.stringify(exportData, null, 2);
  modal.classList.remove("hidden");
});
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
initPalette();
initGrid();
