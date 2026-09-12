"""Serve English Quest on this computer and open its browser URL."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parent
PORT = 8765
URL = f'http://127.0.0.1:{PORT}/index.html'

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def main():
    try:
        server = ThreadingHTTPServer(('127.0.0.1', PORT), partial(Handler, directory=str(ROOT)))
    except OSError:
        try:
            with urllib.request.urlopen(URL, timeout=3) as response:
                if b'<title>English Quest</title>' not in response.read():
                    raise RuntimeError('Port digunakan aplikasi lain.')
            webbrowser.open(URL)
            print('English Quest sudah berjalan. Browser telah dibuka.')
            return
        except Exception:
            print('Port 8765 sedang digunakan aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.')
            input('Tekan Enter untuk menutup...')
            return
    print('English Quest siap dimainkan!')
    print(URL)
    print('Biarkan jendela ini terbuka selama bermain. Ctrl+C untuk berhenti.')
    threading.Timer(0.8, lambda: webbrowser.open(URL)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
