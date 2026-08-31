from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.websocket_manager import manager

from app.database import engine
from app.models import Base

from app.routers.fire_routes import router as fire_router
from app.routers.mission_routes import router as mission_router
from app.routers.analytics_routes import router as analytics_router
from app.routers.ml_routes import router as ml_router


app = FastAPI(
    title="SentinelAI Backend",
    description="AI-Based Military Intelligence & Threat Analysis Dashboard",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.mount(
    "/outputs",
    StaticFiles(directory="outputs"),
    name="outputs"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to SentinelAI Backend",
        "status": "online",
        "system": "AI-Based Military Intelligence & Threat Analysis Dashboard"
    }



@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    print("Client trying to connect...")

    await manager.connect(websocket)

    print("Client connected!")

    try:
        while True:

            data = await websocket.receive_text()

            print("WebSocket message:", data)

    except Exception as e:

        print("Client disconnected")
        print("WebSocket error:", e)

        manager.disconnect(websocket)



app.include_router(
    fire_router,
    prefix="/fire",
    tags=["Fire Detection"]
)


app.include_router(
    mission_router,
    prefix="/fire",
    tags=["Mission History"]
)


app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Mission Analytics"]
)

app.include_router(
    ml_router,
    prefix="/ml",
    tags=["Machine Learning"]
)