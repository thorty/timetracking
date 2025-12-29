# Single-Container Deployment Guide

## Übersicht

Diese Konfiguration kombiniert Frontend und Backend in einem einzigen Docker Container für vereinfachte Server-Administration.

**Architektur:**
- nginx (Port 80) serviert Frontend und leitet `/api/*` an Backend weiter
- Backend läuft intern auf Port 8000 (nicht von außen erreichbar)
- Supervisor verwaltet beide Prozesse

**Vorteile:**
- ✅ Einfache Verwaltung: Nur 1 Container
- ✅ Keine Port-Konflikte auf dem Server
- ✅ Automatisches Process Management mit Supervisor
- ✅ Kleineres Image (~400MB statt 2x separate)

**Nachteile:**
- ⚠️ Backend und Frontend können nicht unabhängig skaliert werden
- ⚠️ Weniger Flexibilität bei Updates (beide müssen gemeinsam deployed werden)

## Local Testing

```bash
# Image bauen
docker build -f Dockerfile.single -t timetracking-app:single .

# Container starten
docker run -d \
  -p 80:80 \
  --name timetracking \
  -v timetracking-data:/app/backend/data \
  timetracking-app:single

# Logs ansehen
docker logs -f timetracking

# Frontend testen
open http://localhost

# API Docs
open http://localhost/docs
```

## Server Deployment

### 1. Mit Docker Compose (Empfohlen)

Erstelle `docker-compose.single.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.single
    ports:
      - "80:80"
    volumes:
      - app-data:/app/backend/data
    restart: unless-stopped
    environment:
      - LOG_LEVEL=INFO

volumes:
  app-data:
```

Auf dem Server:

```bash
# Deployment
docker-compose -f docker-compose.single.yml up -d

# Update (neuer Code)
git pull
docker-compose -f docker-compose.single.yml up -d --build

# Logs
docker-compose -f docker-compose.single.yml logs -f
```

### 2. Mit Docker direkt

```bash
# Image auf Server bauen
docker build -f Dockerfile.single -t timetracking:latest .

# Container starten
docker run -d \
  --name timetracking \
  -p 80:80 \
  -v /var/lib/timetracking:/app/backend/data \
  --restart unless-stopped \
  timetracking:latest

# Update (neuer Code)
docker stop timetracking
docker rm timetracking
docker build -f Dockerfile.single -t timetracking:latest .
docker run -d \
  --name timetracking \
  -p 80:80 \
  -v /var/lib/timetracking:/app/backend/data \
  --restart unless-stopped \
  timetracking:latest
```

### 3. Mit Docker Registry

```bash
# Auf Entwicklungsmaschine
docker build -f Dockerfile.single -t yourusername/timetracking:latest .
docker push yourusername/timetracking:latest

# Auf Server
docker pull yourusername/timetracking:latest
docker run -d \
  --name timetracking \
  -p 80:80 \
  -v /var/lib/timetracking:/app/backend/data \
  --restart unless-stopped \
  yourusername/timetracking:latest
```

## Konfiguration

### Environment Variables

Im Container oder docker-compose:

```yaml
environment:
  - DATABASE_URL=/app/backend/data/timetracking.db
  - LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
  - CORS_ORIGINS=*  # Oder spezifische Domain
```

### HTTPS mit Let's Encrypt (Traefik)

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt
    restart: unless-stopped

  app:
    build:
      context: .
      dockerfile: Dockerfile.single
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=myresolver"
      - "traefik.http.services.app.loadbalancer.server.port=80"
    volumes:
      - app-data:/app/backend/data
    restart: unless-stopped

volumes:
  app-data:
```

## Troubleshooting

### Container startet nicht

```bash
# Logs prüfen
docker logs timetracking

# Interaktiv starten zum Debuggen
docker run -it --rm timetracking-app:single /bin/bash
```

### Backend funktioniert nicht

```bash
# Supervisor Status im Container
docker exec timetracking supervisorctl status

# Backend Logs
docker exec timetracking tail -f /var/log/supervisor/supervisord.log

# Backend manuell testen
docker exec timetracking curl http://127.0.0.1:8000
```

### Nginx Fehler

```bash
# Nginx Konfiguration testen
docker exec timetracking nginx -t

# Nginx Logs
docker exec timetracking tail -f /var/log/nginx/error.log
```

### Datenbank Backup

```bash
# Backup erstellen
docker exec timetracking cp /app/backend/data/timetracking.db /tmp/backup.db
docker cp timetracking:/tmp/backup.db ./backup-$(date +%Y%m%d).db

# Restore
docker cp backup-20240101.db timetracking:/app/backend/data/timetracking.db
docker restart timetracking
```

## Monitoring

### Health Check

```bash
# HTTP Health Check
curl http://localhost/
# Sollte: {"status":"ok","message":"Timetracking API is running"}

# Container Status
docker ps
docker stats timetracking
```

### Logs

```bash
# Alle Logs (nginx + backend)
docker logs -f timetracking

# Nur die letzten 100 Zeilen
docker logs --tail 100 timetracking

# Logs mit Timestamps
docker logs -t timetracking
```

## Performance

### Resource Limits

```yaml
services:
  app:
    # ... andere Konfiguration
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Cache Optimierung

Die nginx Konfiguration cached bereits statische Assets (JS, CSS, Bilder) für 1 Jahr.

## Wartung

### Updates

```bash
# Code aktualisieren
git pull

# Neues Image bauen
docker build -f Dockerfile.single -t timetracking:latest .

# Container neu starten (zero-downtime nicht möglich im Single-Container)
docker stop timetracking
docker rm timetracking
docker run -d \
  --name timetracking \
  -p 80:80 \
  -v /var/lib/timetracking:/app/backend/data \
  --restart unless-stopped \
  timetracking:latest
```

### Cleanup

```bash
# Alte Images entfernen
docker image prune -a

# Unbenutzte Volumes
docker volume prune
```

## Migration von Multi-Container

Wenn du bereits das Multi-Container Setup nutzt:

```bash
# 1. Backup der Daten
docker cp timetracking-backend:/app/data/timetracking.db ./backup.db

# 2. Alte Container stoppen
docker-compose down

# 3. Single Container starten
docker run -d \
  --name timetracking \
  -p 80:80 \
  -v timetracking-data:/app/backend/data \
  timetracking-app:single

# 4. Datenbank wiederherstellen
docker cp backup.db timetracking:/app/backend/data/timetracking.db
docker restart timetracking
```

## Kosten

**VPS Empfehlungen (für Single-Container):**
- **Hetzner Cloud CX11:** 4,15€/Monat (2GB RAM, 20GB SSD) - Ausreichend
- **DigitalOcean Basic:** $6/Monat (1GB RAM, 25GB SSD) - Minimal
- **Netcup VPS 200:** 2,99€/Monat (2GB RAM, 40GB SSD) - Gut

Der Single-Container benötigt ca. 200-300MB RAM unter Last.
