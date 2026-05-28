# ── Étape 1 : Build du frontend React ──────────────────────────────────────
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ── Étape 2 : Backend Python ────────────────────────────────────────────────
FROM python:3.11-slim
WORKDIR /app

# ffmpeg requis par pydub pour les fichiers > 25 Mo
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code backend
COPY backend/ .

# Frontend buildé
COPY --from=frontend-builder /frontend/dist ./frontend/dist

EXPOSE 8080
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"
