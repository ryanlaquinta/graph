import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))

from _lib.algorithms import search
from _lib.http_utils import get_params, send_json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        p = get_params(self)
        try:
            res = search(p.get("algo", ""), p.get("start", ""), p.get("goal", ""))
            send_json(self, res)
        except Exception as e:
            send_json(self, {"error": str(e)}, 400)