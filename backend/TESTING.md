# Backend Step 1 - Testing Guide

## Setup & Installation

### 1. Python Virtual Environment erstellen

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
```

### 2. Dependencies installieren

```bash
pip install -r requirements.txt
```

### 3. Environment-Datei erstellen

Erstelle manuell eine `.env`-Datei im `backend/` Ordner:

```bash
echo "DATABASE_URL=sqlite:///./timetracking.db" > .env
```

### 4. Backend starten

```bash
uvicorn main:app --reload
```

Du solltest sehen:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using WatchFiles
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## Testing mit Browser & curl

### 1. Health Check

**Browser:** Öffne http://localhost:8000
```json
{"status":"ok","message":"Timetracking API is running"}
```

### 2. API-Dokumentation

**Browser:** Öffne http://localhost:8000/docs

FastAPI generiert automatisch eine interaktive API-Dokumentation (Swagger UI)!

### 3. Projects testen (mit curl)

#### Project erstellen
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Project Alpha","color":"blue"}'
```

Response:
```json
{"id":1,"name":"Project Alpha","color":"blue","created_at":"2025-12-18T..."}
```

#### Alle Projects abrufen
```bash
curl http://localhost:8000/api/projects
```

#### Project löschen
```bash
curl -X DELETE http://localhost:8000/api/projects/1
```

### 4. Todos testen

#### Todo erstellen
```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"project_id":1,"title":"Implement Login"}'
```

#### Todo-Status updaten
```bash
curl -X PATCH http://localhost:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

#### Alle Todos abrufen
```bash
curl http://localhost:8000/api/todos
```

### 5. TimeEntries testen

#### TimeEntry erstellen
```bash
curl -X POST http://localhost:8000/api/timeentries \
  -H "Content-Type: application/json" \
  -d '{"todo_id":1,"duration":1500}'
```

(1500 Sekunden = 25 Minuten)

#### Alle TimeEntries abrufen
```bash
curl http://localhost:8000/api/timeentries
```

### 6. Settings testen

#### Settings abrufen (erstellt automatisch Defaults)
```bash
curl http://localhost:8000/api/settings
```

#### Settings updaten
```bash
curl -X PUT http://localhost:8000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"focus_duration":30,"break_duration":10}'
```

---

## Wichtige Hinweise

### Datenbank

- SQLite-File wird automatisch beim ersten Start erstellt: `timetracking.db`
- Liegt im `backend/` Ordner
- Bei Problemen: Datei löschen und neu starten (alle Daten gehen verloren!)

### Cascade-Delete

**Backend macht automatisch Cascade-Deletes:**
- Project löschen → alle Todos und TimeEntries werden gelöscht
- Todo löschen → alle TimeEntries werden gelöscht

Teste das:
```bash
# 1. Project mit Todo und TimeEntry erstellen
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","color":"red"}'

curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"project_id":1,"title":"Test Todo"}'

curl -X POST http://localhost:8000/api/timeentries \
  -H "Content-Type: application/json" \
  -d '{"todo_id":1,"duration":600}'

# 2. Project löschen
curl -X DELETE http://localhost:8000/api/projects/1

# 3. Prüfen - Todos und TimeEntries sind auch weg
curl http://localhost:8000/api/todos
curl http://localhost:8000/api/timeentries
```

### Backend-Logik

**Was das Backend automatisch macht:**
1. **IDs generieren:** Auto-Increment (du sendest keine IDs)
2. **Timestamps:** `created_at` und `timestamp` automatisch
3. **project_id bei TimeEntry:** Backend berechnet aus `todo_id`
4. **Default Settings:** Beim ersten GET werden 25/5 Min erstellt

**Was das Frontend macht:**
- Timer-Logik (Countdown)
- Validierung ≥5 Minuten
- Stats-Aggregation

### Error-Handling

Das Backend wirft HTTPExceptions:
- 404 wenn Project/Todo nicht existiert
- Validierung durch Pydantic (automatisch)

Teste:
```bash
# Todo für nicht-existierendes Project
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"project_id":999,"title":"Test"}'
```

Response: `{"detail":"Project not found"}`

### CORS

CORS ist nur für `http://localhost:5173` aktiviert (SvelteKit dev-server).

Wenn du später anderen Port brauchst, in [main.py](backend/main.py#L22) anpassen:
```python
allow_origins=["http://localhost:5173", "http://localhost:XXXX"]
```

---

## Nächste Schritte

Backend ist fertig! ✅

**Weiter mit Step 2:**
- SvelteKit-Frontend aufsetzen
- API-Service implementieren
- Mit diesem Backend verbinden

**Optionale Verbesserungen:**
- Tests mit pytest schreiben
- Validation für Color-Strings
- Pagination für TimeEntries
- Database-Migrations mit Alembic
