import json
from urllib.parse import parse_qs, urlparse

def get_params(handler):
    q = parse_qs(urlparse(handler.path).query)
    return {k: v[0] for k, v in q.items()}

def send_json(handler, data, code=200):
    body = json.dumps(data).encode()
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)