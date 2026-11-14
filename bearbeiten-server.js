#!/usr/bin/env node
/* Kleiner lokaler Server für „Ansagen bearbeiten“.

   Liefert die Dateien dieses Ordners an den Browser aus und schreibt beim
   Speichern die Datei ansagen-daten.js. Läuft nur auf diesem Rechner
   (127.0.0.1) und braucht nichts außer Node.js – keine weiteren Pakete.
   Gestartet wird er per Doppelklick auf „Ansagen bearbeiten.command“ (Mac)
   oder „Ansagen bearbeiten.cmd“ (Windows). */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const ORDNER = __dirname;
const DATEI = "ansagen-daten.js";
const SICHERUNG = "ansagen-daten.sicherung.js";
const BILD_ENDUNGEN = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const MAX_BILD = 30 * 1024 * 1024;
const ERSTER_PORT = 8765;

const DATEITYPEN = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const KOPF = `/* Inhalte und Einstellungen der Ansagen-Seite.
   Diese Datei wird von „Ansagen bearbeiten“ geschrieben – am einfachsten
   änderst du alles dort (Doppelklick auf „Ansagen bearbeiten.command“ am Mac
   oder „Ansagen bearbeiten.cmd“ unter Windows).
   Sie muss im selben Ordner liegen wie ansagen.html. */
`;

function schreibeDaten(einstellungen, ansagen) {
  const inhalt =
    KOPF +
    "\nconst EINSTELLUNGEN = " + JSON.stringify(einstellungen, null, 2) +
    ";\n\nconst ANSAGEN = " + JSON.stringify(ansagen, null, 2) +
    ";\n";
  const ziel = path.join(ORDNER, DATEI);
  if (fs.existsSync(ziel)) fs.copyFileSync(ziel, path.join(ORDNER, SICHERUNG)); // letzten Stand aufheben
  const vorlaeufig = ziel + ".neu";
  fs.writeFileSync(vorlaeufig, inhalt, "utf8");
  fs.renameSync(vorlaeufig, ziel);
}

const istBild = (name) => BILD_ENDUNGEN.some((e) => name.toLowerCase().endsWith(e));

function bilder() {
  return fs
    .readdirSync(ORDNER)
    .filter((n) => istBild(n) && !n.startsWith("."))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function antwort(res, status, daten) {
  const body = Buffer.from(JSON.stringify(daten), "utf8");
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function fehler(res, status) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
  res.end("Fehler " + status);
}

function eigenerHost(req) {
  const port = req.socket.localPort;
  return ["127.0.0.1:" + port, "localhost:" + port].includes(req.headers.host);
}

function liefereDatei(res, pfad) {
  let teile;
  try {
    teile = decodeURIComponent(pfad).split("/").filter(Boolean);
  } catch {
    return fehler(res, 400);
  }
  // Keine versteckten Dateien und nichts außerhalb dieses Ordners.
  if (teile.some((t) => t.startsWith(".") || /[\\:\0]/.test(t))) return fehler(res, 404);
  const datei = path.join(ORDNER, ...teile);
  fs.readFile(datei, (err, inhalt) => {
    if (err) return fehler(res, 404);
    res.writeHead(200, {
      "Content-Type": DATEITYPEN[path.extname(datei).toLowerCase()] || "application/octet-stream",
      "Content-Length": inhalt.length,
      "Cache-Control": "no-store",
    });
    res.end(inhalt);
  });
}

function get(req, res, url) {
  if (url.pathname === "/") {
    res.writeHead(302, { Location: "/bearbeiten.html", "Cache-Control": "no-store" });
    return res.end();
  }
  if (url.pathname === "/api/ping") return antwort(res, 200, { ansagen: true });
  if (url.pathname === "/api/bilder") return antwort(res, 200, { bilder: bilder() });
  liefereDatei(res, url.pathname);
}

function post(req, res, url) {
  // Nur die eigene Seite darf schreiben: fremde Webseiten können weder
  // den Host noch den Zusatz-Header liefern.
  if (req.headers["x-ansagen"] !== "1") return fehler(res, 403);
  const zuGross = () => antwort(res, 413, { fehler: "Die Datei ist zu groß (höchstens 30 MB)." });
  if (Number(req.headers["content-length"] || 0) > MAX_BILD) {
    req.resume();
    return zuGross();
  }
  const stuecke = [];
  let laenge = 0;
  let abgebrochen = false;
  req.on("data", (stueck) => {
    if (abgebrochen) return;
    laenge += stueck.length;
    if (laenge > MAX_BILD) {
      abgebrochen = true;
      return zuGross();
    }
    stuecke.push(stueck);
  });
  req.on("end", () => {
    if (abgebrochen) return;
    const body = Buffer.concat(stuecke);
    try {
      if (url.pathname === "/api/speichern") {
        const daten = JSON.parse(body.toString("utf8"));
        const istObjekt = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
        const e = daten && daten.einstellungen;
        const a = daten && daten.ansagen;
        if (!istObjekt(e) || !Array.isArray(a) || !a.every(istObjekt)) {
          return antwort(res, 400, { fehler: "Unerwartete Daten." });
        }
        schreibeDaten(e, a);
        return antwort(res, 200, { ok: true });
      }
      if (url.pathname === "/api/bild") {
        let name = url.searchParams.get("name") || "";
        name = path.basename(name.replace(/\\/g, "/")).trim();
        name = name.replace(/[^\p{L}\p{N}_ .()\-]/gu, "_").replace(/^\.+/, "");
        if (!istBild(name) || !body.length) {
          return antwort(res, 400, { fehler: "Bitte eine Bilddatei wählen (PNG, JPG, GIF, WebP oder SVG)." });
        }
        fs.writeFileSync(path.join(ORDNER, name), body);
        return antwort(res, 200, { name, bilder: bilder() });
      }
    } catch (err) {
      // dem Nutzer zeigen statt still zu scheitern
      return antwort(res, 500, { fehler: String(err.message || err) });
    }
    fehler(res, 404);
  });
}

function anfrage(req, res) {
  if (!eigenerHost(req)) return fehler(res, 403);
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" || req.method === "HEAD") return get(req, res, url);
  if (req.method === "POST") return post(req, res, url);
  fehler(res, 405);
}

function laeuftSchon(port) {
  return new Promise((fertig) => {
    const req = http.get({ host: "127.0.0.1", port, path: "/api/ping", timeout: 1000 }, (res) => {
      let text = "";
      res.on("data", (s) => (text += s));
      res.on("end", () => {
        try {
          fertig(JSON.parse(text).ansagen === true);
        } catch {
          fertig(false);
        }
      });
    });
    req.on("timeout", () => req.destroy());
    req.on("error", () => fertig(false));
  });
}

function lausche(server, port) {
  return new Promise((fertig) => {
    server.once("error", () => fertig(false));
    server.listen(port, "127.0.0.1", () => fertig(true));
  });
}

function imBrowserOeffnen(adresse) {
  if (process.env.ANSAGEN_KEIN_BROWSER === "1") return;
  if (process.platform === "win32") return execFile("cmd", ["/c", "start", "", adresse], () => {});
  execFile(process.platform === "darwin" ? "open" : "xdg-open", [adresse], () => {});
}

async function main() {
  for (let port = ERSTER_PORT; port < ERSTER_PORT + 20; port++) {
    const server = http.createServer(anfrage);
    if (await lausche(server, port)) {
      const adresse = `http://127.0.0.1:${port}/bearbeiten.html`;
      console.log("Ansagen bearbeiten läuft: " + adresse);
      console.log("Dieses Fenster offen lassen. Zum Beenden: Fenster schließen.");
      imBrowserOeffnen(adresse);
      return;
    }
    if (await laeuftSchon(port)) {
      // zweiter Doppelklick: nur die Seite öffnen
      console.log("„Ansagen bearbeiten“ läuft bereits – die Seite wird geöffnet.");
      imBrowserOeffnen(`http://127.0.0.1:${port}/bearbeiten.html`);
      return;
    }
  }
  console.error("Es ist kein freier Anschluss (Port) verfügbar.");
  process.exit(1);
}

main();
