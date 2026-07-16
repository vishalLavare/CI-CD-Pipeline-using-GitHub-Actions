import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

try:
    from app.routes import router
except ModuleNotFoundError:
    from routes import router


# -------------------------------------------------------
# Environment Variables
# -------------------------------------------------------

APP_NAME = os.getenv("APP_NAME", "Production CI/CD FastAPI App")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
APP_ENV = os.getenv("APP_ENV", "production")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")

origins = [
    origin.strip()
    for origin in ALLOWED_ORIGINS.split(",")
    if origin.strip()
]


# -------------------------------------------------------
# FastAPI Application
# -------------------------------------------------------

app = FastAPI(
    title=APP_NAME,
    description="Automated deployment project built with GitHub Actions, Docker, Amazon ECR, EC2, Application Load Balancer, and CloudFront.",
    version=APP_VERSION,
)


# -------------------------------------------------------
# CORS Configuration
# -------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------
# API Routes
# -------------------------------------------------------

app.include_router(router, prefix="/api/v1", tags=["CRUD APIs"])


# -------------------------------------------------------
# Root Endpoint
# -------------------------------------------------------

@app.get("/", tags=["Root"])
def root():
    return {
        "application": APP_NAME,
        "version": APP_VERSION,
        "environment": APP_ENV,
        "status": "Running",
        "docs": "/docs",
        "health": "/health"
    }


# -------------------------------------------------------
# Health Endpoint
# -------------------------------------------------------

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": APP_ENV,
        "version": APP_VERSION
    }


# -------------------------------------------------------
# Startup Event
# -------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print(f"Application : {APP_NAME}")
    print(f"Version     : {APP_VERSION}")
    print(f"Environment : {APP_ENV}")
    print(f"CORS Origins: {origins}")
    print("=" * 60)