# Timetracking App

Pomodoro-based time tracking application with project and todo management.

## Features
- ⏱️ Pomodoro Timer with Focus/Break modes
- 📊 Statistics & Charts (Daily, Weekly, All-Time)
- 📁 Project Management with color coding
- ✅ Todo Management with project assignment
- ⚙️ Customizable Pomodoro Settings
- 🎨 Toast Notifications & Error Handling
- 📱 Responsive Design (Mobile & Desktop)

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** CSS Modules
- **Deployment:** Docker + Vercel + Railway

---

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker (optional)

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
echo "DATABASE_URL=sqlite:///./timetracking.db" > .env
uvicorn main:app --reload
```

**Access:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

**Test:**
```bash
pytest test_main.py -v
```

### 2. Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev
```

**Access:** http://localhost:5173

---

## Docker (Single Container)

### Quick Start
```bash
# Build Image
docker build -f Dockerfile.single -t timetracking-app:single .

# Run Container
docker run -d \
  --name timetracking \
  -p 8100:80 \
  -v timetracking-data:/app/backend/data \
  --restart unless-stopped \
  timetracking-app:single
```

**Access:**
- App: http://localhost:8100
- API Docs: http://localhost:8100/docs

### Management
```bash
# View Logs
docker logs -f timetracking

# Stop Container
docker stop timetracking && docker rm timetracking

# Remove Volume (reset database)
docker volume rm timetracking-data
```

---

## Deployment

See [DEPLOYMENT-SINGLE.md](DEPLOYMENT-SINGLE.md) for production deployment guide:
- VPS: Hetzner Cloud, DigitalOcean, Netcup
- HTTPS: Let's Encrypt mit Traefik
└── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── .env
├── Dockerfile.single        # Single-Container Setup
├── nginx.single.conf        # nginx Reverse Proxy Config
├── supervisord.conf         # Process Manager
├── DEPLOYMENT-SINGLE.md     # Deployment Guide
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

---

## Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test locally
4. Commit: `git commit -m "feat: add feature"`
5. Merge to main
6. Auto-deploy (Vercel + Railway)

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./timetracking.db
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
LOG_LEVEL=INFO
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## License
MIT

