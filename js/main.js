function setStatus(text) {
  document.getElementById("status").textContent = text;
}

function ready() {
  if (!S.start || !S.goal) {
    setStatus("Pick a start and a goal node first.");
    return false;
  }
  return true;
}

function addRow(algo, res) {
  const table = document.getElementById("results");
  const oldRow = table.querySelector(`[data-a="${algo}"]`);
  
  if (oldRow) {
    oldRow.remove();
  }

  const tr = document.createElement("tr");
  tr.dataset.a = algo;

  const costText = res.path.length ? res.cost.toFixed(1) : "–";
  tr.innerHTML = `<td><i class="dot" style="background:${COL[algo]}"></i>${NAMES[algo]}</td>
                  <td>${res.explored}</td>
                  <td>${costText}</td>`;

  table.appendChild(tr);
}

canvas.addEventListener("mousemove", function(e) {
});

canvas.addEventListener("click", function(e) {
  const pt = canvasPoint(e);
  const road = roadAt(pt.x, pt.y);

  if (!road) {
    S.hoverEdge = null;
    S.tap = null;
    draw();
    setStatus("No road near that spot. Tap closer to a street.");
    return;
  }

  const best = snapToVertex(road);
  const name = roadLabel(road.a, road.b);

  S.hoverEdge = null;
  S.tap = null;

  if (!S.start || (S.start && S.goal)) {
    resetRun();
    S.start = best;
    S.goal = null;
    setStatus(`Road ${name} detected → Start = ${best.value}. Now tap the goal road/place.`);
  } else if (best !== S.start) {
    resetRun();
    S.goal = best;
    setStatus(`Road ${name} detected → Goal = ${best.value}. Start ${S.start.value}. Press Run.`);
  } else {
    setStatus(`Road ${name} detected, but that is already the start. Pick a different goal.`);
  }

  draw();
});

const algoButtons = document.querySelectorAll("#algoBtns button");
algoButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    algoButtons.forEach(function(b) {
      b.classList.remove("active");
    });
    button.classList.add("active");
    S.algo = button.dataset.algo;
  });
});

document.getElementById("runBtn").onclick = runAlgorithm;
document.getElementById("compareBtn").onclick = compareAll;

document.getElementById("showLabels").onchange = function() {
  draw();
};

document.getElementById("showGraph").onchange = function() {
  draw();
};

document.getElementById("resetBtn").onclick = function() {
  resetRun();
  S.start = null;
  S.goal = null;
  S.hoverEdge = null;
  S.tap = null;
  document.getElementById("results").innerHTML = "";
  setStatus("Tap a start node.");
  draw();
};

setupCanvas();
draw();