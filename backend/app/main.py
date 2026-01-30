from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import ServerSelectionTimeoutError
from app.routers import employees, attendance, dashboard

app = FastAPI(
    title="HRMS Lite API",
    description="RESTful API for employee and attendance management",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.exception_handler(ServerSelectionTimeoutError)
def mongodb_unavailable(request: Request, exc: ServerSelectionTimeoutError):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database unavailable. Please ensure MongoDB is running."},
    )


@app.exception_handler(Exception)
def unhandled_exception(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "An internal error occurred."},
    )


@app.get("/health")
def health():
    return {"status": "ok"}
