@echo off
rem Doppelklick startet "Ansagen bearbeiten" und oeffnet die Seite im Browser.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  echo Bitte einmalig von https://nodejs.org installieren ^(Version "LTS"^).
  echo Danach diese Datei erneut doppelklicken.
  pause
  exit /b 1
)
node bearbeiten-server.js
if errorlevel 1 pause
