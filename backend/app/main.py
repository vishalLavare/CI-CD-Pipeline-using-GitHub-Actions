from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
try:
    from app.routes import router
except ModuleNotFoundError:
    from routes import router

app = FastAPI(
    title="Production CI/CD FastAPI App",
    description="Automated deployment project built with GitHub Actions, Docker, ECR, and EC2.",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend origin domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the CRUD API router with a clean API prefix
app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Production CI/CD FastAPI Application!",
        "status": "Running",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    """Endpoint for checking application status. Used in the CI/CD deployment validation script."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": "production"
    }
