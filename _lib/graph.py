import math
from .data import positions, edges

class Vertex:
    def __init__(self, value, x, y):
        self.value = value
        self.X = x
        self.Y = y
        self.neighbors = []

    def add_neighbor(self, vertex):
        if vertex not in self.neighbors:
            self.neighbors.append(vertex)


def build_graph():
    vs = {name: Vertex(name, x, y) for name, (x, y) in positions.items()}
    for a, b in edges:
        vs[a].add_neighbor(vs[b])
        vs[b].add_neighbor(vs[a])
    return vs


vertices = build_graph()

def dist(a, b):
    """Straight-line distance: edge cost AND heuristic h(n)."""
    return math.hypot(a.X - b.X, a.Y - b.Y)