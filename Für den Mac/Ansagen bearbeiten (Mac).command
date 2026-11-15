#!/bin/zsh
# Doppelklick öffnet „Ansagen bearbeiten“ in Safari so, dass „Speichern“ die Datei direkt schreibt.
cd "$(dirname "$0")" || exit 1
# Beim Doppelklick im Finder fehlen die üblichen Installationsorte im Suchpfad.
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js wurde nicht gefunden."
  echo "Bitte einmalig von https://nodejs.org installieren (Version „LTS“)."
  echo "Danach diese Datei erneut doppelklicken."
  read -r "?Zum Schließen Eingabetaste drücken … "
  exit 1
fi
exec node helfer.js
