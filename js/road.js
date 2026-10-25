function search(algo, start, goal) {
  if (!start || !goal) {
    return { steps: [], path: [], cost: 0, explored: 0 };
  }

  function getPriority(g, node) {
    if (algo === "ucs") {
      return g;
    }
    if (algo === "greedy") {
      return dist(node, goal);
    }
    return g + dist(node, goal); // A* search
  }

  const frontier = [{ f: getPriority(0, start), name: start.value }];
  const g = { [start.value]: 0 };
  const cameFrom = { [start.value]: null };
  const closed = new Set();
  const steps = [];

  while (frontier.length > 0) {
    // Sort frontier by lowest f cost
    frontier.sort(function(a, b) {
      return a.f - b.f;
    });

    const currentItem = frontier.shift();
    const name = currentItem.name;

    if (closed.has(name)) {
      continue;
    }
    closed.add(name);

    const currentVertex = vertices[name];
    steps.push({ node: name, from: cameFrom[name] });

    if (currentVertex === goal) {
      break;
    }

    for (let i = 0; i < currentVertex.neighbors.length; i++) {
      const neighbor = currentVertex.neighbors[i];

      if (closed.has(neighbor.value)) {
        continue;
      }

      const newG = g[name] + dist(currentVertex, neighbor);

      if (algo === "greedy") {
        if (!(neighbor.value in cameFrom)) {
          cameFrom[neighbor.value] = name;
          g[neighbor.value] = newG;
          frontier.push({ f: getPriority(newG, neighbor), name: neighbor.value });
        }
      } else if (!(neighbor.value in g) || newG < g[neighbor.value]) {
        g[neighbor.value] = newG;
        cameFrom[neighbor.value] = name;
        frontier.push({ f: getPriority(newG, neighbor), name: neighbor.value });
      }
    }
  }

  const path = [];
  if (goal.value in cameFrom) {
    let current = goal.value;
    while (current !== null) {
      path.push(current);
      current = cameFrom[current];
    }
  }
  path.reverse();

  let cost = 0;
  for (let i = 1; i < path.length; i++) {
    cost += dist(vertices[path[i - 1]], vertices[path[i]]);
  }

  return {
    steps: steps,
    path: path,
    cost: cost,
    explored: steps.length
  };
}