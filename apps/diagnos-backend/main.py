from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user import router as user_router
from routers.photo import router as photo_router
from routers.classification import router as classification_router
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diagnos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(photo_router)
app.include_router(classification_router)
