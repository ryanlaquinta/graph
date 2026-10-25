import heapq
import itertools
from .graph import dist, vertices

ALGOS = ("ucs", "greedy", "astar")


def search(algo, start_name, goal_name):
    if algo not in ALGOS:
        raise ValueError(f"Unknown algorithm: '{algo}'")
    if start_name not in vertices or goal_name not in vertices:
        raise ValueError("Unknown start or goal vertex")

    start, goal = vertices[start_name], vertices[goal_name]

    def priority(g, n):
        if algo == "ucs":
            return g
        if algo == "greedy":
            return dist(n, goal)
        return g + dist(n, goal)

    counter = itertools.count()
    frontier = [(priority(0, start), next(counter), start_name)]
    g = {start_name: 0}
    came_from = {start_name: None}
    closed = set()
    steps = []

    while frontier:
        _, _, name = heapq.heappop(frontier)
        if name in closed:
            continue
        closed.add(name)
        cur = vertices[name]
        steps.append({"node": name, "from": came_from[name]})
        
        if cur is goal:
            break

        for nb in cur.neighbors:
            if nb.value in closed:
                continue
            new_g = g[name] + dist(cur, nb)

            if algo == "greedy":
                if nb.value not in came_from:
                    came_from[nb.value] = name
                    g[nb.value] = new_g
                    heapq.heappush(frontier, (priority(new_g, nb), next(counter), nb.value))
            elif nb.value not in g or new_g < g[nb.value]:
                g[nb.value] = new_g
                came_from[nb.value] = name
                heapq.heappush(frontier, (priority(new_g, nb), next(counter), nb.value))

    path = []
    if goal_name in came_from:
        n = goal_name
        while n is not None:
            path.append(n)
            n = came_from[n]
        path.reverse()

    cost = sum(dist(vertices[a], vertices[b]) for a, b in zip(path, path[1:]))

    return {
        "steps": steps,
        "path": path,
        "cost": cost,
        "explored": len(steps),
        "engine": "python",
    }