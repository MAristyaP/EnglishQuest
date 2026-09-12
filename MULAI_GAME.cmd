@echo off
cd /d "%~dp0"
title English Quest - Server Game
where python >nul 2>nul
if errorlevel 1 (
  echo Python tidak ditemukan. Buka index.html dengan Google Chrome atau Microsoft Edge.
  pause
  exit /b 1
)
python "%~dp0start_game.py"
if errorlevel 1 pause
