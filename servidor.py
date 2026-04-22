import os
import webbrowser
from flask import Flask, send_from_directory

# 1. Cria pasta public se não existir
if not os.path.exists('public'):
    os.makedirs('public')
    print("📁 Pasta 'public' criada")

# 2. Move arquivos HTML/CSS/JS para public (se estiverem na raiz)
for file in os.listdir('.'):
    if file.endswith(('.html', '.css', '.js')) and file != 'servidor.py':
        os.rename(file, os.path.join('public', file))
        print(f"📄 Movido: {file} -> public/")

# 3. Flask super simples
app = Flask(__name__, static_folder='public')

@app.route('/')
def home():
    return send_from_directory('public', 'login.html')

@app.route('/<path:path>')
def serve(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 SERVIDOR NEUROPULSE - À PROVA DE ERROS")
    print("=" * 50)
    print("🌐 Acesse: http://localhost:5000")
    print("=" * 50)
    
    # Abre o navegador automaticamente
    webbrowser.open('http://localhost:5000')
    
    app.run(debug=True, port=5000)