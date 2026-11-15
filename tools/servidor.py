"""Servidor local de desenvolvimento e testes.

O `python -m http.server` aceita só 5 conexões na fila e recusa as outras
(ERR_CONNECTION_REFUSED) quando o Playwright abre várias páginas ao mesmo
tempo, o que deixava testes instáveis. Este servidor usa threads e uma fila
maior. Só para uso local: serve a pasta do site em 127.0.0.1.

Uso: python tools/servidor.py [porta]   (padrão 4173)
"""
import functools
import http.server
import os
import sys


class Servidor(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True


def main() -> None:
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=raiz)
    with Servidor(("127.0.0.1", porta), handler) as srv:
        print(f"Servindo {raiz} em http://127.0.0.1:{porta}", flush=True)
        srv.serve_forever()


if __name__ == "__main__":
    main()
