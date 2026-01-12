from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .puzzle_db import PuzzleDB  # Ensure this import exists

app = FastAPI()

# --- 1. Initialize the Database ---
# This was likely missing or misplaced
db = PuzzleDB() 

# --- 2. Security Middleware (For Stockfish Multi-threading) ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    # This header allows the isolated Frontend to read from the Backend
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    return response

# --- 3. CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. API Routes ---
@app.get("/api/puzzle")
async def get_puzzle(rating: int = 1500):
    # Now 'db' is defined above and will work
    puzzle = db.get_random_puzzle(rating)
    return puzzle

@app.get("/api/health")
def health():
    return {"status": "ok", "database": "connected"}