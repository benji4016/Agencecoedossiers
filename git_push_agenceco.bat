@echo off
title Push vers Agenceco - GitHub
cd /d "%~dp0"

echo.
echo ================================
echo     PUSH VERS GITHUB AGENCECO
echo ================================
echo.

REM Vérifie ou change l'URL distante
git remote set-url origin https://github.com/benji4016/Agencecoedossiers.git

REM Ajoute tous les fichiers modifiés
git add .

echo.
set /p message=Entre le message de commit : 

REM Effectue le commit
git commit -m "%message%"

echo.
REM Push vers GitHub
git push origin main

echo.
echo ✅ Push terminé ! Appuie sur une touche pour fermer...
pause >nul
