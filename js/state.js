const S = {
  algo: "astar",
  start: null,
  goal: null,
  visited: new Set(),
  visitEdges: [],
  current: null,
  path: [],
  extraPaths: [],
  walkerPos: null,
  hoverEdge: null,
  tap: null,
  timer: null,
  running: false
};

const COL = {
  ucs: "#9333ea",
  greedy: "#ea580c",
  astar: "#2563eb"
};

const NAMES = {
  ucs: "Uniform Cost",
  greedy: "Greedy",
  astar: "A*"
};

function clearTimers() {
  clearTimeout(S.timer);
  S.running = false;
}

function resetRun() {
  clearTimers();
  S.visited = new Set();
  S.visitEdges = [];
  S.current = null;
  S.path = [];
  S.extraPaths = [];
  S.walkerPos = null;
  S.hoverEdge = null;
  S.tap = null;
}