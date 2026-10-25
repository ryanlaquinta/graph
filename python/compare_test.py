import os
import sys

api_path = os.path.join(os.path.dirname(__file__), "..", "api")
sys.path.insert(0, api_path)

from _lib.algorithms import search

pairs = [
    ("V24", "V9"),
    ("V28", "V51"),
    ("V3", "V47"),
    ("V25", "V12"),
    ("V54", "V13")
]

algorithms = ["ucs", "greedy", "astar"]

for start, goal in pairs:
    print("\n" + start + " -> " + goal)
    print(f"  {'Algorithm':<8} {'Explored':>8} {'Cost (px)':>10}  Path")

    for algo in algorithms:
        res = search(algo, start, goal)
        path_str = " > ".join(res["path"])
        
        explored = res["explored"]
        cost = res["cost"]
        
        print(f"  {algo:<8} {explored:>8} {cost:>10.1f}  {path_str}")