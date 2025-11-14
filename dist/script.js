// ===== Laser Grid 背景 =====
const gridCanvas = document.getElementById("grid");
const gtx = gridCanvas.getContext("2d");

function resizeGrid() {
  gridCanvas.width = window.innerWidth;
  gridCanvas.height = window.innerHeight;
}
resizeGrid();
window.addEventListener("resize", resizeGrid);

let t = 0; // 動畫時間軸

function drawGrid() {
  gtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

  const spacing = 40;
  const speed = 0.015;

  t += speed;

  gtx.strokeStyle = "rgba(0,255,255,0.25)";
  gtx.lineWidth = 1;

  gtx.beginPath();

  // 垂直線
  for (let x = -gridCanvas.width; x < gridCanvas.width * 2; x += spacing) {
    const offset = Math.sin(t + x * 0.01) * 20;
    gtx.moveTo(x + offset, 0);
    gtx.lineTo(x + offset, gridCanvas.height);
  }

  // 水平線
  for (let y = -gridCanvas.height; y < gridCanvas.height * 2; y += spacing) {
    const offset = Math.cos(t + y * 0.01) * 20;
    gtx.moveTo(0, y + offset);
    gtx.lineTo(gridCanvas.width, y + offset);
  }

  gtx.stroke();

  requestAnimationFrame(drawGrid);
}

drawGrid();

/* ================================================
   粒子吸附文字（你的版本）+ 霓虹外框電流 Pulse
   ================================================ */

const canvas = document.getElementById("canvas");
const outline = document.getElementById("outline");
const ctx = canvas.getContext("2d");
const octx = outline.getContext("2d");

let W = canvas.width = outline.width = window.innerWidth;
let H = canvas.height = outline.height = window.innerHeight;

let particles = [];
const particleSize = 3;
const text = "MONSTER LAB";   // ← 可改「怪獸研究所」

/* ===============================
   Step 1：隱藏 Canvas 畫出文字
=============================== */
const bufferCanvas = document.createElement("canvas");
const bufferCtx = bufferCanvas.getContext("2d");
bufferCanvas.width = W;
bufferCanvas.height = H;

bufferCtx.fillStyle = "#ffffff";
bufferCtx.font = "bold 150px Microsoft JhengHei";
bufferCtx.textAlign = "center";
bufferCtx.fillText(text, W / 2, H / 2);

/* ===============================
   Step 2：取得像素資料
=============================== */
const imageData = bufferCtx.getImageData(0, 0, W, H).data;

/* ===============================
   Step 3：建立粒子資料（你的邏輯）
=============================== */
for (let y = 0; y < H; y += 6) {
  for (let x = 0; x < W; x += 6) {
    const alpha = imageData[(y * W + x) * 4 + 3];
    if (alpha > 128) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        targetX: x,
        targetY: y,
        speed: 0.05 + Math.random() * 0.05,
        arrived: false
      });
    }
  }
}

/* =======================================
   Step 4：粒子動畫（你的版本）
======================================= */

let allArrived = false;

function animate() {
  ctx.clearRect(0, 0, W, H);

  let arrivedCount = 0;

  particles.forEach(p => {
    p.x += (p.targetX - p.x) * p.speed;
    p.y += (p.targetY - p.y) * p.speed;

    const dx = p.targetX - p.x;
    const dy = p.targetY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 3) {
      p.arrived = true;
      arrivedCount++;
    }

    ctx.fillStyle = "#00f7ff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
    ctx.fill();
  });

  // 95% 粒子到位 → 啟動外框脈動
  if (!allArrived && arrivedCount >= particles.length * 0.95) {
    allArrived = true;
    triggerNeonOutline();
  }

  requestAnimationFrame(animate);
}

animate();

/* =======================================
   ⭐ Step 5：霓虹外框電流 Pulse 效果
======================================= */

function triggerNeonOutline() {
  let pulse = 0;
  let growing = true;

  function pulseAnim() {
    octx.clearRect(0, 0, W, H);

    octx.save();
    octx.lineWidth = 6;
    octx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
    octx.shadowBlur = pulse * 40;
    octx.shadowColor = "#00eaff";

    octx.font = "bold 150px Microsoft JhengHei";
    octx.textAlign = "center";
    octx.strokeText(text, W / 2, H / 2);
    octx.restore();

    if (growing) {
      pulse += 0.03;
      if (pulse >= 1) growing = false;
    } else {
      pulse -= 0.03;
      if (pulse <= 0) return; // Pulse 結束
    }

    requestAnimationFrame(pulseAnim);
  }

  pulseAnim();
}

/* =======================================
   Step 6：視窗 Resize
======================================= */
window.addEventListener("resize", () => location.reload());