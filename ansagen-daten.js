/* Inhalte und Einstellungen der Ansagen-Seite.
   Diese Datei wird von „Ansagen bearbeiten“ geschrieben – am einfachsten
   änderst du alles dort (Doppelklick auf „Ansagen bearbeiten.command“).
   Sie muss im selben Ordner liegen wie ansagen.html. */

const EINSTELLUNGEN = {
  "gemeinde": "FEV Spaichingen",
  "wochentag": 0,
  "beginn": "10:00",
  "frueherBeginn": "09:30",
  "frueherAmSonntagNr": 1,
  "frueherAnTerminen": [],
  "sekundenProFolie": 12,
  "grosserCountdownAb": 60,
  "kleineUhrInDerEcke": true,
  "schlussTitel": "Herzlich willkommen",
  "schlussText": "Der Gottesdienst beginnt"
};

const ANSAGEN = [
  {
    "rubrik": "Willkommen",
    "titel": "Schön, dass du da bist",
    "wann": "",
    "text": "Nimm dir einen Kaffee, such dir einen Platz – wir fangen gleich an."
  },
  {
    "anzeigen": true,
    "rubrik": "Montag",
    "titel": "Ü60",
    "wann": "Montag · 16:00 Uhr",
    "bibelstelle": "Matthäus 1",
    "text": "Der Treff für alle über 60."
  },
  {
    "anzeigen": false,
    "ausfall": "Fällt diese Woche aus",
    "rubrik": "Dienstag",
    "titel": "Kleingruppen & Bibelstunde",
    "wann": "Dienstags · 19:00 Uhr · im wöchentlichen Wechsel",
    "text": "Eine Woche treffen sich die Hauskreise, in der nächsten ist Bibelstunde."
  },
  {
    "rubrik": "Freitag",
    "titel": "Freitags bei uns",
    "liste": [
      "18:00 Uhr | Gebet",
      "18:00 Uhr | Jungschar | 8 bis 11 Jahre",
      "18:00 Uhr | Teenkreis | 11 bis 15 Jahre | fällt aus",
      "20:00 Uhr | Jugend | ab 15 Jahren"
    ]
  },
  {
    "anzeigen": true,
    "rubrik": "Besonderes",
    "titel": "Titel der Veranstaltung",
    "wann": "Samstag, 5. Dezember · 15:00 Uhr",
    "text": "Ein kurzer Satz dazu.",
    "bild": "beispiel-flyer.svg"
  },
  {
    "anzeigen": true,
    "bild": "beispiel-flyer.svg",
    "bildGross": true
  },
  {
    "rubrik": "Sonntag",
    "titel": "Gebet & Gottesdienst",
    "wann": "Sonntags · 9:30 Uhr Gebet · 10:00 Uhr Gottesdienst",
    "text": "Am ersten Sonntag im Monat beginnt der Gottesdienst schon um 9:30 Uhr – ohne Gebet davor."
  }
];
