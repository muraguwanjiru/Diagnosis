from fastapi import FastAPI

app = FastAPI(title="Diagnos API")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Diagnos Backend is Running"}
