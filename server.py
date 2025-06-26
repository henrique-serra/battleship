#!/usr/bin/env python3
"""
Servidor HTTP simples com suporte a CORS para desenvolvimento
"""
import http.server
import socketserver
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        # Força o tipo MIME correto para arquivos JS
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.mjs'):
            return 'application/javascript'
        return mimetype

if __name__ == '__main__':
    PORT = 8000
    
    print(f"Servidor iniciando na porta {PORT}")
    print(f"Acesse: http://localhost:{PORT}")
    print("Pressione Ctrl+C para parar")
    
    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor parado.")