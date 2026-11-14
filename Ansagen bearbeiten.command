#!/bin/zsh
# Doppelklick startet „Ansagen bearbeiten“ und öffnet die Seite im Browser.
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 wurde nicht gefunden."
  echo "Bitte einmalig im Terminal eingeben:  xcode-select --install"
  echo "Danach diese Datei erneut doppelklicken."
  read -r "?Zum Schließen Eingabetaste drücken … "
  exit 1
fi
exec python3 bearbeiten-server.py
