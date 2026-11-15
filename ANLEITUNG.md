# Ansagen – Anleitung

Alles steckt in **einer einzigen Datei: `Ansagen.html`** – die Anzeige, das Bearbeiten,
alle Texte und alle Bilder. Es muss nichts installiert werden, und es braucht kein Internet.

## Am Sonntag: Ansagen zeigen

1. Doppelklick auf **`Ansagen.html`**. Die Ansagen laufen sofort.
2. Taste **F** (oder Doppelklick auf die Seite) schaltet auf Vollbild.

Der Countdown richtet sich nach der Uhr des Rechners. In den letzten 60 Sekunden wird groß
heruntergezählt, danach steht das Schlussbild.

| Taste      | Was passiert                     |
|------------|----------------------------------|
| F          | Vollbild an / aus                |
| ← →        | eine Folie zurück / weiter       |
| Leertaste  | anhalten / weiterlaufen          |
| E          | zum Bearbeiten wechseln          |

## Ansagen bearbeiten

1. `Ansagen.html` öffnen, Maus bewegen, oben auf **Bearbeiten** klicken (oder Taste **E**).
2. Links die Folie wählen, in der Mitte ändern. Rechts siehst du sofort, wie es auf dem Beamer aussieht.
3. Oben rechts **Speichern** (Strg+S, am Mac ⌘S).

**Probelauf** zeigt die Anzeige und zählt 90 Sekunden herunter – so siehst du den großen
Countdown und das Schlussbild, ohne bis Sonntag zu warten.

### Speichern – je nach Rechner

- **Windows (Edge oder Chrome):** Beim ersten Speichern fragt der Browser einmal, wohin.
  Wähle die Datei `Ansagen.html` in deinem Ordner aus und bestätige „Ersetzen“.
  Danach genügt ein Klick. (Nach einem Neustart des Browsers fragt er kurz, ob er die Datei
  ändern darf – **Erlauben** klicken.)
- **Mac mit Safari:** Safari darf Dateien nicht direkt überschreiben. Zwei Wege:
  - *Bequem:* im Ordner **„Für den Mac“** Doppelklick auf **`Ansagen bearbeiten (Mac).command`**.
    Es öffnet sich ein Terminal-Fenster (offen lassen) und die Bearbeiten-Seite. Speichern schreibt dann direkt.
    Dafür muss Node.js auf dem Mac installiert sein (bei dir ist es das schon).
  - *Ohne alles:* `Ansagen.html` normal öffnen. Beim Speichern landet eine neue `Ansagen.html`
    im Ordner „Downloads“. Schiebe sie in deinen Ansagen-Ordner und ersetze die alte.

### Was wo geht

| Ich möchte …                             | So geht's                                                                    |
|------------------------------------------|------------------------------------------------------------------------------|
| eine Folie diese Woche weglassen         | Haken **Diese Folie zeigen** entfernen (die Folie bleibt erhalten)           |
| eine Folie nur bis zu einem Tag zeigen   | unter **Zeitraum** ein Datum bei „Zeigen bis“ eintragen – danach verschwindet sie von selbst |
| eine Folie als ausgefallen zeigen        | unter **Fällt aus** den Haken setzen, Text der roten Marke anpassen          |
| einen einzelnen Termin ausfallen lassen  | beim Termin **fällt aus** anhaken, Text frei wählbar                         |
| die Reihenfolge ändern                   | Pfeile ↑ ↓ in der Liste links                                                |
| eine neue Folie                          | **+ Neue Folie** unten in der Liste, oder **Folie duplizieren**              |
| einen Flyer oder ein Foto zeigen         | unter **Bild oder Flyer** auf **Bild vom Rechner hinzufügen …** klicken oder das Bild hineinziehen; dann wählen: rechts neben dem Text, ganze Folie oder als Hintergrund |
| Uhrzeit, früherer Beginn, Farben …       | Reiter **Einstellungen** oben                                                |
| einen Fehler rückgängig machen           | **Einstellungen** → ganz unten **Stand vor dem letzten Speichern zurückholen** |

## Gut zu wissen

- **Mitnehmen:** Kopiere einfach `Ansagen.html` auf den Gemeinde-Rechner (USB-Stick, E-Mail, Cloud-Ordner).
  Die Bilder sind in der Datei enthalten, es gibt keine weiteren Dateien, die fehlen könnten.
- Große Fotos werden beim Hinzufügen automatisch verkleinert. Bilder, die keine Folie mehr benutzt,
  werden beim Speichern aus der Datei entfernt.
- Ein PDF kann nicht gezeigt werden – mach ein Bildschirmfoto vom Flyer oder speichere ihn als Bild.
- Wird ein Text zu lang für die Folie, wird er von selbst kleiner. Kurze Texte liest man aus der Ferne besser.
- Bei viel Tageslicht im Raum: **Einstellungen → Farben → Hell** ausprobieren.
- Meldet der Mac beim ersten Doppelklick auf die `.command`-Datei, sie könne nicht geöffnet werden:
  Rechtsklick → **Öffnen** → **Öffnen**.
- Nichts geht ins Internet. Der Mac-Helfer läuft nur auf dem eigenen Rechner (Adresse `127.0.0.1`).
