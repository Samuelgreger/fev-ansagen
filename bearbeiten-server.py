#!/usr/bin/env python3
"""Kleiner lokaler Server für „Ansagen bearbeiten“.

Liefert die Dateien dieses Ordners an den Browser aus und schreibt beim
Speichern die Datei ansagen-daten.js. Läuft nur auf diesem Rechner
(127.0.0.1) und braucht nichts außer Python 3.
Gestartet wird er per Doppelklick auf „Ansagen bearbeiten.command“.
"""
import json
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ORDNER = os.path.dirname(os.path.abspath(__file__))
DATEI = "ansagen-daten.js"
SICHERUNG = "ansagen-daten.sicherung.js"
BILD_ENDUNGEN = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")
MAX_BILD = 30 * 1024 * 1024
ERSTER_PORT = 8765

KOPF = """/* Inhalte und Einstellungen der Ansagen-Seite.
   Diese Datei wird von „Ansagen bearbeiten“ geschrieben – am einfachsten
   änderst du alles dort (Doppelklick auf „Ansagen bearbeiten.command“).
   Sie muss im selben Ordner liegen wie ansagen.html. */
"""


def schreibe_daten(einstellungen, ansagen):
    inhalt = (
        KOPF
        + "\nconst EINSTELLUNGEN = "
        + json.dumps(einstellungen, ensure_ascii=False, indent=2)
        + ";\n\nconst ANSAGEN = "
        + json.dumps(ansagen, ensure_ascii=False, indent=2)
        + ";\n"
    )
    ziel = os.path.join(ORDNER, DATEI)
    if os.path.exists(ziel):  # letzten Stand aufheben
        shutil.copyfile(ziel, os.path.join(ORDNER, SICHERUNG))
    vorlaeufig = ziel + ".neu"
    with open(vorlaeufig, "w", encoding="utf-8") as f:
        f.write(inhalt)
    os.replace(vorlaeufig, ziel)


def bilder():
    return sorted(
        (n for n in os.listdir(ORDNER)
         if n.lower().endswith(BILD_ENDUNGEN) and not n.startswith(".")),
        key=str.lower,
    )


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ORDNER, **kwargs)

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def antwort(self, status, daten):
        body = json.dumps(daten, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def eigener_host(self):
        port = self.server.server_address[1]
        return self.headers.get("Host") in ("127.0.0.1:%d" % port, "localhost:%d" % port)

    def do_GET(self):
        if not self.eigener_host():
            return self.send_error(403)
        pfad = urllib.parse.urlsplit(self.path).path
        if pfad == "/":
            self.send_response(302)
            self.send_header("Location", "/bearbeiten.html")
            return self.end_headers()
        if pfad == "/api/ping":
            return self.antwort(200, {"ansagen": True})
        if pfad == "/api/bilder":
            return self.antwort(200, {"bilder": bilder()})
        if any(teil.startswith(".") for teil in urllib.parse.unquote(pfad).split("/")):
            return self.send_error(404)
        super().do_GET()

    def do_POST(self):
        # Nur die eigene Seite darf schreiben: fremde Webseiten können weder
        # den Host noch den Zusatz-Header liefern.
        if not self.eigener_host() or self.headers.get("X-Ansagen") != "1":
            return self.send_error(403)
        url = urllib.parse.urlsplit(self.path)
        try:
            laenge = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            return self.send_error(400)
        if laenge > MAX_BILD:
            return self.antwort(413, {"fehler": "Die Datei ist zu groß (höchstens 30 MB)."})
        body = self.rfile.read(laenge)
        try:
            if url.path == "/api/speichern":
                daten = json.loads(body.decode("utf-8"))
                e, a = daten.get("einstellungen"), daten.get("ansagen")
                if not isinstance(e, dict) or not isinstance(a, list) \
                        or not all(isinstance(x, dict) for x in a):
                    return self.antwort(400, {"fehler": "Unerwartete Daten."})
                schreibe_daten(e, a)
                return self.antwort(200, {"ok": True})
            if url.path == "/api/bild":
                name = urllib.parse.parse_qs(url.query).get("name", [""])[0]
                name = os.path.basename(name.replace("\\", "/")).strip()
                name = re.sub(r"[^\w .()\-]", "_", name).lstrip(".")
                if not name.lower().endswith(BILD_ENDUNGEN) or not body:
                    return self.antwort(400, {"fehler": "Bitte eine Bilddatei wählen (PNG, JPG, GIF, WebP oder SVG)."})
                with open(os.path.join(ORDNER, name), "wb") as f:
                    f.write(body)
                return self.antwort(200, {"name": name, "bilder": bilder()})
        except Exception as fehler:  # dem Nutzer zeigen statt still zu scheitern
            return self.antwort(500, {"fehler": str(fehler)})
        self.send_error(404)


def laeuft_schon(port):
    try:
        with urllib.request.urlopen("http://127.0.0.1:%d/api/ping" % port, timeout=1) as r:
            return json.loads(r.read().decode("utf-8")).get("ansagen") is True
    except Exception:
        return False


def main():
    oeffnen = os.environ.get("ANSAGEN_KEIN_BROWSER") != "1"
    server = None
    for port in range(ERSTER_PORT, ERSTER_PORT + 20):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
            break
        except OSError:
            if laeuft_schon(port):  # zweiter Doppelklick: nur die Seite öffnen
                print("„Ansagen bearbeiten“ läuft bereits – die Seite wird geöffnet.")
                if oeffnen:
                    webbrowser.open("http://127.0.0.1:%d/bearbeiten.html" % port)
                return
    if server is None:
        sys.exit("Es ist kein freier Anschluss (Port) verfügbar.")
    adresse = "http://127.0.0.1:%d/bearbeiten.html" % server.server_address[1]
    print("Ansagen bearbeiten läuft: " + adresse)
    print("Dieses Fenster offen lassen. Zum Beenden: Fenster schließen.")
    if oeffnen:
        webbrowser.open(adresse)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
