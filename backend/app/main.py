from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import router
from app.auth_routes import router as auth_router

# Bikin semua tabel di database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bridge Education API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://bridge-education.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "Bridge Education API is running!"}