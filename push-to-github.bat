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

REM ── Configure git user directly ────────────────────────────────────────
git config user.name "bioinfoguru"
git config user.email "support@bioinfo.guru"

REM ── Stage everything ───────────────────────────────────────────────────
echo.
echo [+] Staging changes...
git add --all

REM ── Commit ─────────────────────────────────────────────────────────────
echo [+] Committing...
git commit -m "deploy: update whiteboard"

REM ── Set / update remote ────────────────────────────────────────────────
echo [+] Setting remote...
git remote remove origin >nul 2>&1
git remote add origin git@github.com:bioinfoguru/whiteboard.git

REM ── Push ───────────────────────────────────────────────────────────────
echo [+] Pushing to master on GitHub...
git push -f -u origin master

echo.
echo ========================================
echo   Push complete !
echo   GitHub Actions will now deploy to
echo   https://wb.bioinfo.guru
echo ========================================