#!/usr/bin/env node
/* Helfer für den Mac (Safari): Safari darf Dateien nicht direkt überschreiben.
   Dieser kleine Helfer zeigt „Ansagen.html“ über eine Adresse auf diesem Rechner
   (127.0.0.1) und schreibt beim Speichern die Datei neu. Er braucht nur Node.js,
   keine weiteren Pakete, und nichts geht ins Internet.
   Unter Windows (Edge, Chrome) wird er nicht gebraucht. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const DATEI = path.join(__dirname, "..", "Ansagen.html");
const SICHERUNG = path.join(__dirname, "..", "Ansagen.sicherung.html");
const MAX = 300 * 1024 * 1024;
const ERSTER_PORT = 8765;

function antwort(res, status, typ, inhalt) {
  const body = Buffer.from(inhalt, "utf8");
  res.writeHead(status, { "Content-Type": typ + "; charset=utf-8", "Content-Length": body.length, "Cache-Control": "no-store" });
  res.end(body);
}

function anfrage(req, res) {
  const port = req.socket.localPort;
  if (!["127.0.0.1:" + port, "localhost:" + port].includes(req.headers.host)) return antwort(res, 403, "text/plain", "Nicht erlaubt");
  const pfad = new URL(req.url, "http://127.0.0.1").pathname;
  if (req.method === "GET" && pfad === "/api/ping") return antwort(res, 200, "application/json", '{"ansagenHelfer":true}');
  if (req.method === "GET" && pfad === "/") { res.writeHead(302, { Location: "/Ansagen.html" }); return res.end(); }
  if (req.method === "GET" && pfad === "/Ansagen.html") {
    return fs.readFile(DATEI, (err, inhalt) => err ? antwort(res, 404, "text/plain", "Ansagen.html fehlt") : antwort(res, 200, "text/html", inhalt.toString("utf8")));
  }
  if (req.method === "POST" && pfad === "/api/speichern") {
    // Nur die eigene Seite darf schreiben: fremde Webseiten können diesen Zusatz nicht mitschicken.
    if (req.headers["x-ansagen"] !== "1") return antwort(res, 403, "text/plain", "Nicht erlaubt");
    const stuecke = [];
    let laenge = 0;
    req.on("data", s => { laenge += s.length; if (laenge <= MAX) stuecke.push(s); });
    req.on("end", () => {
      try {
        if (laenge > MAX) return antwort(res, 413, "text/plain", "Die Datei ist zu groß geworden – bitte weniger oder kleinere Bilder verwenden.");
        const text = Buffer.concat(stuecke).toString("utf8");
        if (!text.startsWith("<!doctype html>") || !text.includes('<script id="daten"') || !text.trimEnd().endsWith("</html>")) {
          return antwort(res, 400, "text/plain", "Unerwarteter Inhalt – es wurde nichts gespeichert.");
        }
        if (fs.existsSync(DATEI)) fs.copyFileSync(DATEI, SICHERUNG);   // letzten Stand aufheben
        fs.writeFileSync(DATEI + ".neu", text, "utf8");
        fs.renameSync(DATEI + ".neu", DATEI);
        antwort(res, 200, "text/plain", "ok");
      } catch (err) {
        antwort(res, 500, "text/plain", String(err.message || err));
      }
    });
    return;
  }
  antwort(res, 404, "text/plain", "Nicht gefunden");
}

function lausche(server, port) {
  return new Promise(fertig => {
    server.once("error", () => fertig(false));
    server.listen(port, "127.0.0.1", () => fertig(true));
  });
}

(async () => {
  for (let port = ERSTER_PORT; port < ERSTER_PORT + 20; port++) {
    const server = http.createServer(anfrage);
    if (await lausche(server, port)) {
      const adresse = `http://127.0.0.1:${port}/Ansagen.html#bearbeiten`;
      console.log("Ansagen bearbeiten läuft: " + adresse);
      console.log("Dieses Fenster offen lassen. Zum Beenden: Fenster schließen.");
      if (process.env.ANSAGEN_KEIN_BROWSER !== "1") execFile("open", [adresse], () => {});
      return;
    }
  }
  console.error("Kein freier Anschluss gefunden.");
  process.exit(1);
})();
