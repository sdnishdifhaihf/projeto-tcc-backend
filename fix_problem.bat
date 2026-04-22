@echo off
echo 🔧 CORRIGINDO PROBLEMA DO FLASK...

:: 1. Fecha TUDO
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im chrome.exe >nul 2>&1

:: 2. Limpa cache do navegador
echo 🧹 Limpando cache...
start chrome://settings/clearBrowserData

:: 3. Recria estrutura
cd /d "%~dp0"
if exist public rmdir /s /q public
mkdir public

:: 4. Move seus arquivos para public/
move *.html public\ >nul 2>&1
move *.css public\ >nul 2>&1
move *.js public\ >nul 2>&1
if exist IMAGEM move IMAGEM public\ >nul 2>&1

echo ✅ Estrutura recriada!
echo.
echo 🚀 Execute start.bat novamente
pause