@echo off
:: Script automatique pour faire un push Git

:: Étape 1 : Ajouter tous les fichiers
git add .

:: Étape 2 : Demander un message de commit
set /p msg=Entrez votre message de commit : 
git commit -m "%msg%"

:: Étape 3 : Push vers la branche principale
git push origin main

pause
