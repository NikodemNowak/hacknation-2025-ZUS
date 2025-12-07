# System ZUS - Quick Start

## Uruchomienie

### Backend
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
→ Backend: http://localhost:8000

### Frontend (nowy terminal)
```cmd
cd frontend
npm install
npm run dev
```
→ Frontend: http://localhost:5173

## Konfiguracja (opcjonalna)

Plik `backend/.env`:
```env
GROQ_API_KEY=twoj_klucz_api
```

