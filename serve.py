import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print("Server running at http://localhost:8095")
http.server.HTTPServer(('', 8095), http.server.SimpleHTTPRequestHandler).serve_forever()
