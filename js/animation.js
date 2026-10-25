function getDelay() {
  const speed = parseInt(document.getElementById("speed").value) || 6;
  return 520 - speed * 50;
}

function runAlgorithm() {
  if (!ready()) return;
  resetRun();

  const res = search(S.algo, S.start, S.goal);
  S.running = true;
  let i = 0;

  function tick() {
    if (!S.running) return;

    if (i < res.steps.length) {
      const step = res.steps[i++];
      S.visited.add(step.node);
      S.current = vertices[step.node];

      if (step.from) {
        S.visitEdges.push([step.from, step.node]);
      }

      setStatus(`${NAMES[S.algo]}: exploring ${step.node} (${i}/${res.steps.length})`);
      draw();
      S.timer = setTimeout(tick, getDelay());
    } else {
      S.current = null;
      animatePath(res);
    }
  }

  tick();
}

function animatePath(res) {
  if (!res.path.length) {
    setStatus("No path found.");
    S.running = false;
    draw();
    return;
  }

  S.path = res.path;
  let index = 0;
  let progress = 0;

  function getStepSpeed() {
    const speed = parseInt(document.getElementById("speed").value) || 6;
    return 0.02 + speed * 0.008;
  }

  function animate() {
    if (!S.running) return;

    if (index < res.path.length - 1) {
      const start = vertices[res.path[index]];
      const end = vertices[res.path[index + 1]];

      S.walkerPos = {
        X: start.X + (end.X - start.X) * progress,
        Y: start.Y + (end.Y - start.Y) * progress
      };

      progress += getStepSpeed();

      if (progress >= 1.0) {
        progress = 0;
        index++;
      }

      draw();
      S.timer = requestAnimationFrame(animate);
    } else {
      S.walkerPos = vertices[res.path[res.path.length - 1]];
      S.running = false;
      draw();
      addRow(S.algo, res);
      setStatus(`${NAMES[S.algo]} done! Explored ${res.explored} nodes, cost ${res.cost.toFixed(1)} px.`);
    }
  }

  S.running = true;
  animate();
}

function compareAll() {
  if (!ready()) return;
  resetRun();

  const algos = ["ucs", "greedy", "astar"];
  for (let i = 0; i < algos.length; i++) {
    const algo = algos[i];
    const res = search(algo, S.start, S.goal);
    addRow(algo, res);
    S.extraPaths.push({ path: res.path, color: COL[algo] });
  }

  const astarRes = search("astar", S.start, S.goal);
  if (astarRes.path.length) {
    S.walkerPos = vertices[astarRes.path[astarRes.path.length - 1]];
  }

  setStatus("Compare: purple = UCS, orange = Greedy, blue = A*.");
  draw();
}