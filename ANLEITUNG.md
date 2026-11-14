# Ansagen – Anleitung

## Ansagen zeigen

Doppelklick auf **`ansagen.html`**. Taste **F** (oder Doppelklick auf die Seite) schaltet auf Vollbild,
mit den Pfeiltasten blätterst du von Hand.

## Ansagen bearbeiten

1. Doppelklick auf **`Ansagen bearbeiten.command`**.
   Es öffnet sich ein Terminal-Fenster (einfach offen lassen) und im Browser die Seite „Ansagen bearbeiten“.
2. Links die Folie wählen, in der Mitte ändern – die Vorschau zeigt es sofort.
3. Oben rechts **Speichern** (oder ⌘S).
4. `ansagen.html` neu laden (⌘R) oder über **Ansagen öffnen** aufrufen – jetzt ist die Änderung zu sehen.

Fertig? Terminal-Fenster schließen.

### Was wo geht

| Ich möchte …                              | So geht's                                                                 |
|-------------------------------------------|---------------------------------------------------------------------------|
| eine Folie diese Woche weglassen          | Haken **Folie anzeigen** entfernen (die Folie bleibt erhalten)            |
| eine Folie als ausgefallen zeigen         | **Ganze Folie als ausgefallen markieren**, Text der roten Marke anpassen  |
| einen einzelnen Termin ausfallen lassen   | beim Termin **Fällt aus** anhaken, Text frei wählbar                      |
| die Reihenfolge ändern                    | Pfeile ↑ ↓ in der Liste links                                             |
| eine neue Folie                           | **+ Neue Folie** unten in der Liste, oder **Duplizieren**                 |
| eine Bibelstelle (z. B. Ü60)              | Feld **Bibelstelle** – leer lassen, wenn es keine gibt                    |
| einen Flyer zeigen                        | unter **Flyer / Bild** auswählen oder **Bild vom Mac hinzufügen …**, dann „Rechts neben dem Text“ oder „Bildschirmfüllend“ |
| Uhrzeit, Wochentag, Dauer pro Folie …     | Reiter **Einstellungen** oben                                             |
| den Countdown ausprobieren                | **Probelauf** – zählt 90 Sekunden herunter                                |

## Gut zu wissen

- Alle Inhalte stehen in **`ansagen-daten.js`**. Diese Datei, `ansagen.html` und die Bilder müssen im selben Ordner liegen.
- Vor jedem Speichern wird der vorherige Stand als `ansagen-daten.sicherung.js` aufgehoben. Ging etwas schief:
  `ansagen-daten.js` löschen und die Sicherung in `ansagen-daten.js` umbenennen.
- Zum Bearbeiten wird Node.js gebraucht (JavaScript außerhalb des Browsers). Fehlt es auf einem Mac,
  einmalig von https://nodejs.org installieren (Version „LTS“), danach erneut doppelklicken.
- Meldet der Mac beim ersten Doppelklick, die Datei könne nicht geöffnet werden (z. B. nach einem Download):
  Rechtsklick auf `Ansagen bearbeiten.command` → **Öffnen** → **Öffnen**.
- Das Bearbeiten läuft nur auf diesem Mac (Adresse `127.0.0.1`), nichts geht ins Internet.
