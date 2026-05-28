import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from openai import OpenAI
import tempfile

app = FastAPI()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".mp3", ".mp4", ".wav", ".m4a", ".ogg", ".webm")):
        raise HTTPException(status_code=400, detail="Format non supporté. Utilisez MP3, WAV, M4A ou OGG.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="fr"
            )
        return {"transcription": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)

app.mount("/", StaticFiles(directory="static", html=True), name="static")
