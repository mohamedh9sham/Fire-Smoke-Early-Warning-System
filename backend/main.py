from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import shutil
import uuid
from pathlib import Path
from detector import detect_fire_smoke

app = FastAPI(title="Fire & Smoke Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/")
def root():
    return {"name": "Fire & Smoke Detection API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    file_ext = Path(file.filename).suffix if file.filename else ".jpg"
    temp_filename = f"input_{uuid.uuid4().hex[:8]}{file_ext}"
    temp_path = UPLOADS_DIR / temp_filename

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = detect_fire_smoke(str(temp_path))

    if result["annotated_image_url"]:
        result["annotated_image_url"] = f"http://localhost:8000{result['annotated_image_url']}"

    return JSONResponse(content=result)
