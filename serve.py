#!/usr/bin/env python3
"""
ContrastLab - Local Development Server
Launches a lightweight HTTP server on port 3000 (or first available port)
and opens the application in your default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    port = PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"\n=======================================================")
                print(f" ContrastLab - Color Palette & Accessibility Studio")
                print(f"=======================================================")
                print(f" Serving locally at: http://localhost:{port}")
                print(f" Press Ctrl+C to stop the server.\n")
                
                try:
                    webbrowser.open(f"http://localhost:{port}")
                except Exception:
                    pass

                httpd.serve_forever()
                break
        except OSError:
            port += 1
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    run()
