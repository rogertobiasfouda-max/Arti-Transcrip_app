import os
import tempfile
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from openai import OpenAI

app = FastAPI(title="Actiwork Transcription API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

MAX_CHUNK_BYTES = 24 * 1024 * 1024  # 24 MB

MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]


# ── Helpers ────────────────────────────────────────────────────────────────

def format_timestamp(seconds: float) -> str:
    """Formater en (m:ss) ou (h:mm:ss)."""
    s = int(seconds)
    if s < 3600:
        return f"({s // 60}:{s % 60:02d})"
    return f"({s // 3600}:{(s % 3600) // 60:02d}:{s % 60:02d})"


def format_srt_ts(seconds: float) -> str:
    """Formater en HH:MM:SS,mmm pour SRT."""
    ms = int(round((seconds % 1) * 1000))
    s = int(seconds)
    return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d},{ms:03d}"


def split_audio_if_needed(path: str, file_size: int) -> List[dict]:
    """Découper le fichier audio si > 24 Mo, sinon retourner tel quel."""
    if file_size <= MAX_CHUNK_BYTES:
        return [{"path": path, "offset": 0.0, "temp": False}]

    try:
        import pydub
    except ImportError:
        raise HTTPException(500, "pydub non installé — impossible de découper le fichier volumineux.")

    try:
        audio = pydub.AudioSegment.from_file(path)
    except Exception as exc:
        raise HTTPException(
            400,
            f"Impossible de lire le fichier audio. ffmpeg est-il installé ? ({exc})",
        )

    duration_ms = len(audio)
    ratio = MAX_CHUNK_BYTES / file_size
    chunk_ms = int(duration_ms * ratio * 0.9)
    chunks, offset = [], 0

    while offset < duration_ms:
        end = min(offset + chunk_ms, duration_ms)
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        audio[offset:end].export(tmp.name, format="mp3")
        tmp.close()
        chunks.append({"path": tmp.name, "offset": offset / 1000.0, "temp": True})
        offset = end

    return chunks


def transcribe_chunk(path: str, offset: float) -> List[dict]:
    """Transcrire un morceau audio via Whisper, décaler les timestamps."""
    with open(path, "rb") as f:
        resp = client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            language="fr",
            response_format="verbose_json",
            timestamp_granularities=["segment"],
        )

    return [
        {
            "start": seg.start + offset,
            "end": seg.end + offset,
            "text": seg.text.strip(),
            "timestamp_label": format_timestamp(seg.start + offset),
        }
        for seg in resp.segments
    ]


def build_paragraphs(segments: List[dict], pause: float = 2.0, max_group: int = 5) -> list:
    """Regrouper les segments en paragraphes (pause > 2s ou max 5 segments)."""
    paras, cur = [], []
    for i, seg in enumerate(segments):
        cur.append({"ts": seg["timestamp_label"], "text": seg["text"]})
        last = i == len(segments) - 1
        big_pause = not last and (segments[i + 1]["start"] - seg["end"]) > pause
        if last or big_pause or len(cur) >= max_group:
            paras.append(cur)
            cur = []
    return paras


def build_txt(title: str, date: str, paragraphs: list) -> str:
    lines = [title, date, ""]
    for para in paragraphs:
        lines.append(" ".join(f"{s['ts']} {s['text']}" for s in para))
        lines.append("")
    return "\n".join(lines)


def build_md(title: str, date: str, paragraphs: list) -> str:
    lines = [f"# {title}", f"_{date}_", ""]
    for para in paragraphs:
        lines.append(" ".join(f"**{s['ts']}** {s['text']}" for s in para))
        lines.append("")
    return "\n".join(lines)


def build_srt(segments: List[dict]) -> str:
    blocks = []
    for i, s in enumerate(segments, 1):
        blocks.append(
            f"{i}\n{format_srt_ts(s['start'])} --> {format_srt_ts(s['end'])}\n{s['text']}"
        )
    return "\n\n".join(blocks)


# ── Endpoints ──────────────────────────────────────────────────────────────

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    allowed = {".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".mp4"}
    ext = Path(file.filename).suffix.lower()

    if ext not in allowed:
        raise HTTPException(
            400,
            f"Format non supporté. Formats acceptés : {', '.join(sorted(allowed))}",
        )

    content = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext or ".mp3") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        chunks = split_audio_if_needed(tmp_path, len(content))
        segments: List[dict] = []

        for chunk in chunks:
            segments.extend(transcribe_chunk(chunk["path"], chunk["offset"]))
            if chunk["temp"]:
                os.unlink(chunk["path"])

        title = Path(file.filename).stem
        dt = datetime.now()
        date = f"{dt.day} {MOIS[dt.month - 1]} {dt.year}, {dt.hour:02d}:{dt.minute:02d}"
        paragraphs = build_paragraphs(segments)

        return {
            "title": title,
            "date": date,
            "segments": segments,
            "paragraphs": paragraphs,
            "exports": {
                "txt": build_txt(title, date, paragraphs),
                "md": build_md(title, date, paragraphs),
                "srt": build_srt(segments),
            },
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(500, str(exc))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


# ── Servir le frontend buildé ───────────────────────────────────────────────
_dist = Path(__file__).parent / "frontend" / "dist"
if _dist.exists():
    app.mount("/", StaticFiles(directory=str(_dist), html=True), name="static")
