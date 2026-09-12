"""Start the local ANT-1 console. Python 3 standard library only."""
import argparse
import functools
import http.server
import pathlib
import threading
import urllib.parse
import webbrowser

ROOT = pathlib.Path(__file__).resolve().parent

class LocalHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.md': 'text/plain'}

    def send_head(self):
        parts = pathlib.PurePosixPath(urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)).parts
        candidate = pathlib.Path(self.translate_path(self.path)).resolve()
        if any(p.startswith('.') for p in parts) or (candidate != ROOT and ROOT not in candidate.parents):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def log_message(self, format, *args):
        pass

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    handler = functools.partial(LocalHandler, directory=str(ROOT))
    try:
        with http.server.ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
            url = f'http://127.0.0.1:{args.port}'
            print(f'ANT-1 is ready at {url}\nKeep this window open. Press Ctrl+C to stop.')
            if not args.no_browser:
                threading.Timer(0.5, lambda: webbrowser.open(url)).start()
            server.serve_forever()
    except KeyboardInterrupt:
        print('\nLaboratory stopped.')
    except OSError as exc:
        print(f'Could not start the server: {exc}\nTry: python start_ant1.py --port 8001')
        raise SystemExit(1)

if __name__ == '__main__':
    main()
