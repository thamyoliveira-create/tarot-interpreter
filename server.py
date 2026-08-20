#!/usr/bin/env python3
"""
Servidor local HTTP para testar e executar o Tarot Interpreter.
Basta executar: python3 server.py
E acessar: http://localhost:3000
"""
import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"=====================================================")
        print(f" 🔮 Tarot Interpreter (Rider-Waite-Smith)")
        print(f" Servidor iniciado em: http://localhost:{PORT}")
        print(f" Pressione Ctrl+C para encerrar.")
        print(f"=====================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")
            sys.exit(0)
