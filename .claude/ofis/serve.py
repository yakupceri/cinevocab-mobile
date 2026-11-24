#!/usr/bin/env python3
"""Sanal ofis icin kucuk yerel sunucu. Yalnizca bu bilgisayar (127.0.0.1); aga acma secenegi bilerek yok.
Yalnizca 3 dosya sunar. Kullanim:  python3 .claude/ofis/serve.py   ->  http://127.0.0.1:8766
"""
import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
ALLOWED = {"/": "index.html", "/index.html": "index.html", "/durum.json": "durum.json", "/agents.json": "agents.json"}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=HERE, **k)

    def do_GET(self):
        # DNS rebinding korumasi: yalnizca bu adresle gelen istek kabul edilir (baska alan adi 127.0.0.1'e cozulse bile okuyamaz)
        port = self.server.server_address[1]
        if (self.headers.get("Host") or "").lower() not in ("127.0.0.1:%d" % port, "localhost:%d" % port):
            self.send_error(403)
            return
        path = self.path.split("?", 1)[0]
        if path not in ALLOWED:
            self.send_error(404)
            return
        self.path = "/" + ALLOWED[path]
        # Deneme: CV_OFIS_DIR verilirse durum.json oradan okunur (canli veriye dokunmadan sayfa denenir)
        self.directory = (os.environ.get("CV_OFIS_DIR") or HERE) if path == "/durum.json" else HERE
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, *a):
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8766)
    a = ap.parse_args()
    srv = None
    for port in range(a.port, a.port + 20):          # port doluysa siradakini dene
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
            break
        except OSError:
            continue
    if srv is None:
        raise SystemExit("Bos port bulunamadi (%d-%d)." % (a.port, a.port + 19))
    print("Ofis: http://127.0.0.1:%d" % port, flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
