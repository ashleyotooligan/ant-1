@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 start_ant1.py
) else (
  python start_ant1.py
)
pause
