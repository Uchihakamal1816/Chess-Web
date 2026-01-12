# ♟️ Chess-Web — Chess Puzzle Training Platform (Full-Stack + Docker)

A **full-stack chess puzzle training application** with **Docker containerization**.  
Practice chess puzzles with **instant feedback**, **rating-based difficulty**, and an **interactive drag & drop board** powered by a FastAPI backend + React frontend.

---

##  Live Demo (Local)

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:8000  
- **API Docs (Swagger):** http://localhost:8000/docs  

---

##  Features

-  **Interactive chess board** (drag & drop)
-  **2+ million chess puzzles** from the Lichess database
-  **Rating-based puzzle selection** (1000–2500 ELO)
-  **Fast DuckDB queries**
-  **Real-time move validation**
-  **Responsive React frontend**
-  **Docker + Docker Compose setup**
-  **Mobile-friendly UI**

---

##  Quick Start

###  Prerequisites
Make sure you have:
- **Docker**
- **Docker Compose**
- **4GB+ RAM** *(for puzzle database processing)*
- **8GB free disk space**

---

### ⚡ One Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Chess-Web

# Start everything (first build takes 5–10 minutes)
docker compose up --build
```
### Project Structure
```bash
Chess-Web/
├── backend/                 # FastAPI Python Backend
│   ├── app.py               # Main API server
│   ├── puzzle_db.py         # DuckDB database handler
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container setup
│
├── frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/      # React components
│   │   └── styles/          # CSS files
│   ├── public/
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.js       # Vite configuration
│ 
├── data/                    # Chess Puzzle Data
│   └── puzzles.csv          # 4GB Lichess puzzle dataset
│
├── docker-compose.yml       # Multi-container orchestration
├── .env.example             # Environment variables template
└── README.md                # Documentation
```

### First-Time Setup (Puzzle Dataset)
Main: Add Lichess Puzzle Data
Download/prepare your puzzle dataset (usually puzzles.csv) and place it inside the data/ folder

### Docker Commands Cheatsheet
Development
```bash
# Build and start all services
docker compose up --build

# Start in background (detached mode)
docker compose up -d

# View real-time logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop + remove volumes
docker compose down -v
```
Maintenance
```bash
# Rebuild specific service
docker compose build backend
docker compose build frontend

# Restart specific service
docker compose restart backend

# Execute commands inside containers
docker compose exec backend python --version
docker compose exec frontend npm list

# Check service status
docker compose ps

# Cleanup unused docker resources
docker system prune -a --volumes
```




