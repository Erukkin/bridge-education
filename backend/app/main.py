from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import router

# Bikin semua tabel di database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bridge Education API")

# CORS — izinkan React frontend akses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # development
        "https://bridge-education.vercel.app"  # production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Bridge Education API is running!"}