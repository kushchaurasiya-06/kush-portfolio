"""Local preview server for the portfolio.

Same as `python3 -m http.server`, but tells the browser never to cache,
so every reload shows the latest edits (stale copies caused old bugs to linger).

Run:  python3 serve.py        then open http://localhost:5173
"""
import http.server
import socketserver

PORT = 5173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        # YouTube embeds need to know which site they're on (prevents "Error 153")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("", PORT), NoCacheHandler) as httpd:
        print(f"Serving on http://localhost:{PORT}")
        httpd.serve_forever()
