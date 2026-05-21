@echo off
echo ========================================
echo   Whiteboard - Git Push to GitHub
echo   git@github.com:bioinfoguru/whiteboard.git
echo ========================================

cd /d "%~dp0"

REM ── Init repo if needed ────────────────────────────────────────────────
if not exist ".git" (
    echo No .git directory found. Initializing new repository...
    git init
)

REM ── Configure git user if not set ─────────────────────────────────────
git config user.name >nul 2>&1
if errorlevel 1 (
    git config user.name "bioinfoguru"
)
git config user.email >nul 2>&1
if errorlevel 1 (
    git config user.email "support@bioinfo.guru"
)

REM ── Stage everything ───────────────────────────────────────────────────
echo.
echo [+] Staging changes...
"C:\Program Files\Git\cmd\git.exe" add --all
if errorlevel 1 (
    git add --all
)

REM ── Commit ─────────────────────────────────────────────────────────────
echo [+] Committing...
git commit -m "deploy: update whiteboard" 2>nul
if errorlevel 1 (
    echo [i] Nothing new to commit (working tree clean).
)

REM ── Set / update remote ────────────────────────────────────────────────
echo [+] Setting remote...
git remote remove origin 2>nul
git remote add origin git@github.com:bioinfoguru/whiteboard.git

REM ── Get branch name ───────────────────────────────────────────────────
for /f "delims=" %%i in ('git branch --show-current') do set "BRANCH=%%i"
echo [+] Pushing to %BRANCH% on GitHub...

REM ── Push ───────────────────────────────────────────────────────────────
git push -u origin "%BRANCH%"

echo.
echo ========================================
echo   Push complete ^!
echo   GitHub Actions will now deploy to
echo   https://wb.bioinfo.guru
echo ========================================
