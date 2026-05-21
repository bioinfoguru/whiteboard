@echo off
echo ========================================
echo   Whiteboard - Git Push to GitHub
echo   git@github.com:bioinfoguru/whiteboard.git
echo ========================================

REM ── Short (8.3) path avoids space issues in cmd ──────────────────────────
set "GIT=C:\PROGRA~1\Git\cmd\git.exe"

REM ── Ensure we are in the right directory ──────────────────────────────────
cd /d "%~dp0"

REM ── Init repo if needed ───────────────────────────────────────────────────
%GIT% rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo No .git directory found. Initialising repository...
    %GIT% init
)

REM ── Configure git user ────────────────────────────────────────────────────
%GIT% config user.name >nul 2>&1
if errorlevel 1 %GIT% config user.name "bioinfoguru"
%GIT% config user.email >nul 2>&1
if errorlevel 1 %GIT% config user.email "bioinfoguru@users.noreply.github.com"

REM ── Stage ─────────────────────────────────────────────────────────────────
echo.
echo [+] Staging changes...
%GIT% add --all

REM ── Commit ────────────────────────────────────────────────────────────────
echo [+] Committing...
%GIT% commit -m "deploy: update whiteboard" 2>nul
if errorlevel 1 (
    echo [i] Nothing new to commit (working tree clean).
) else (
    echo [+] Committed.
)

REM ── Remote ────────────────────────────────────────────────────────────────
echo [+] Setting remote origin...
%GIT% remote remove origin 2>nul
%GIT% remote add origin git@github.com:bioinfoguru/whiteboard.git

REM ── Branch name ───────────────────────────────────────────────────────────
for /f "tokens=*" %%b in ('%GIT% branch --show-current') do set "BR=%%b"
if "%BR%"=="" set "BR=master"

REM ── Push ──────────────────────────────────────────────────────────────────
echo [+] Pushing to %BR%...
%GIT% push -u origin "%BR%"

echo.
echo ========================================
echo   Push complete!
echo   GitHub Actions will now deploy to
echo   https://wb.bioinfo.guru
echo ========================================
