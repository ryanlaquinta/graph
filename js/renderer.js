const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

const img = new Image();
let imgOK = false;

const imgPeople1 = new Image();
imgPeople1.src = "./people1.png";

const imgPeople2 = new Image();
imgPeople2.src = "./people2.png";

const REF_W = 720;
const REF_H = 340;
const OFFSET_X = 0;
const OFFSET_Y = 0;

let sx = 1;
let sy = 1;

img.onload = function() {
  imgOK = true;
  setupCanvas();
  draw();
};

img.onerror = function() {
  imgOK = false;
  setupCanvas();
  draw();
  setStatus("map.jpg not found.");
};

img.src = "./map.jpg";

imgPeople1.onload = function() {
  draw();
};

imgPeople2.onload = function() {
  draw();
};

function setupCanvas() {
  if (imgOK) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  } else {
    canvas.width = 1440;
    canvas.height = 680;
  }
  sx = canvas.width / REF_W;
  sy = canvas.height / REF_H;
}

function px(v) {
  return v.X * sx + OFFSET_X;
}

function py(v) {
  return v.Y * sy + OFFSET_Y;
}

function canvasPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * canvas.width / rect.width,
    y: (e.clientY - rect.top) * canvas.height / rect.height
  };
}

function line(a, b) {
  if (a && b) {
    ctx.beginPath();
    ctx.moveTo(px(a), py(a));
    ctx.lineTo(px(b), py(b));
    ctx.stroke();
  }
}

function drawPath(names, color, w) {
  if (names.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  for (let i = 0; i < names.length; i++) {
    const v = vertices[names[i]];
    if (v) {
      if (i === 0) {
        ctx.moveTo(px(v), py(v));
      } else {
        ctx.lineTo(px(v), py(v));
      }
    }
  }

  ctx.stroke();
}

function drawCharacters(r) {
  const iconSize = 40 * r;

  if (S.goal && imgPeople2.complete && imgPeople2.naturalWidth > 0) {
    const gx = px(S.goal);
    const gy = py(S.goal);
    ctx.drawImage(imgPeople2, gx - iconSize / 2, gy - iconSize, iconSize, iconSize);
  }

  const walker = S.walkerPos || S.start;
  if (walker && imgPeople1.complete && imgPeople1.naturalWidth > 0) {
    const wx = px(walker);
    const wy = py(walker);
    ctx.drawImage(imgPeople1, wx - iconSize / 2, wy - iconSize, iconSize, iconSize);
  }
}

function draw() {
  const r = canvas.width / 720;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (imgOK) {
    ctx.drawImage(img, 0, 0);
  } else {
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (document.getElementById("showGraph").checked) {
    ctx.strokeStyle = "rgba(90, 90, 90, 0.55)";
    ctx.lineWidth = 2 * r;
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      line(vertices[edge[0]], vertices[edge[1]]);
    }
  }

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 4 * r;
  for (let i = 0; i < S.visitEdges.length; i++) {
    const edge = S.visitEdges[i];
    line(vertices[edge[0]], vertices[edge[1]]);
  }

  for (let i = 0; i < S.extraPaths.length; i++) {
    const p = S.extraPaths[i];
    drawPath(p.path, p.color, 7 * r);
  }
  drawPath(S.path, "#2563eb", 8 * r);

  const showLabels = document.getElementById("showLabels").checked;
  const nodeList = Object.values(vertices);

  for (let i = 0; i < nodeList.length; i++) {
    const v = nodeList[i];
    let color = "#1f2937";
    let rad = 5 * r;

    if (S.visited.has(v.value)) color = "#f59e0b";
    if (v === S.current) { color = "#ef4444"; rad = 7 * r; }
    if (v === S.start)   { color = "#16a34a"; rad = 9 * r; }
    if (v === S.goal)    { color = "#dc2626"; rad = 9 * r; }

    ctx.beginPath();
    ctx.arc(px(v), py(v), rad, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2 * r;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    if (showLabels) {
      ctx.font = `${9 * r}px system-ui, sans-serif`;
      ctx.textAlign = "center";

      const w = ctx.measureText(v.value).width;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(px(v) - w / 2 - 2 * r, py(v) + rad + 1 * r, w + 4 * r, 11 * r);

      ctx.fillStyle = "#111";
      ctx.fillText(v.value, px(v), py(v) + rad + 9.5 * r);
    }
  }

  drawCharacters(r);
}