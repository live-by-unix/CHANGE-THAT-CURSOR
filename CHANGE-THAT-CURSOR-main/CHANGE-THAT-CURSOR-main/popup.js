const upload = document.getElementById('upload');
const canvas = document.getElementById('editor');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const container = document.getElementById('canvas-container');

let img = new Image();
let startX, startY, isDragging = false;
let circle = { x: 0, y: 0, r: 0 };

upload.onchange = (e) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      container.style.display = 'block';
      saveBtn.style.display = 'block';
      draw();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  if (circle.r > 0) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.strokeStyle = "#007AFF";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fill();
  }
}

canvas.onmousedown = (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  startX = (e.clientX - rect.left) * scaleX;
  startY = (e.clientY - rect.top) * scaleY;
  isDragging = true;
};

canvas.onmousemove = (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const currX = (e.clientX - rect.left) * scaleX;
  const currY = (e.clientY - rect.top) * scaleY;
  circle.x = startX;
  circle.y = startY;
  circle.r = Math.sqrt(Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2));
  draw();
};

canvas.onmouseup = () => isDragging = false;

saveBtn.onclick = () => {
  const output = document.createElement('canvas');
  output.width = 32;
  output.height = 32;
  const oCtx = output.getContext('2d');
  
  oCtx.beginPath();
  oCtx.arc(16, 16, 16, 0, Math.PI * 2);
  oCtx.clip();
  
  oCtx.drawImage(img, 
    circle.x - circle.r, circle.y - circle.r, circle.r * 2, circle.r * 2, 
    0, 0, 32, 32
  );

  chrome.storage.local.set({ customCursor: output.toDataURL() }, () => window.close());
};

resetBtn.onclick = () => {
  chrome.storage.local.remove("customCursor", () => window.close());
};
