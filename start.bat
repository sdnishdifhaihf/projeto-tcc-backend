@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 NEUROPULSE - SERVIDOR DE DESENVOLVIMENTO
echo ========================================
echo.

:: 1. Para TUDO que possa estar interferindo
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

:: 2. Garante que está na pasta certa
cd /d "%~dp0"
echo 📂 Pasta atual: %CD%

:: 3. Verifica estrutura
if not exist public (
    echo 📁 Criando pasta 'public'...
    mkdir public
    echo ✅ Pasta criada
)

:: 4. Move arquivos para public/ se estiverem na raiz
echo 📄 Organizando arquivos...
if exist *.html (
    move *.html public\ >nul 2>&1
    echo ✅ HTMLs movidos
)
if exist *.css (
    move *.css public\ >nul 2>&1
    echo ✅ CSSs movidos
)
if exist *.js (
    move *.js public\ >nul 2>&1
    echo ✅ JavaScripts movidos
)
if exist IMAGEM (
    if not exist public\IMAGEM mkdir public\IMAGEM
    xcopy /E /I /Y IMAGEM public\IMAGEM\ >nul 2>&1
    echo ✅ Imagens movidas
)

:: 5. Cria servidor Flask mínimo
echo from flask import Flask, send_from_directory > server.py
echo import os >> server.py
echo. >> server.py
echo app = Flask(__name__, static_folder='public') >> server.py
echo. >> server.py
echo @app.route('/') >> server.py
echo def index(): >> server.py
echo     return send_from_directory('public', 'login.html') >> server.py
echo. >> server.py
echo @app.route('/<path:path>') >> server.py
echo def serve_static(path): >> server.py
echo     return send_from_directory('public', path) >> server.py
echo. >> server.py
echo if __name__ == '__main__': >> server.py
echo     print('='*50) >> server.py
echo     print('🌐 NEUROPULSE - Backend Online') >> server.py
echo     print('='*50) >> server.py
echo     print('📡 Endpoints:') >> server.py
echo     print('   http://localhost:5000/           - Login') >> server.py
echo     print('   http://localhost:5000/Musicoterapia.html - Musicoterapia') >> server.py
echo     print('='*50) >> server.py
echo     app.run(debug=True, port=5000, host='127.0.0.1') >> server.py

:: 6. Inicia servidor
echo.
echo 🔧 Iniciando servidor...
echo 🌐 Abrindo navegador...
start http://localhost:5000
python server.py