#  Mini Time Tracker

Ein einfaches Web-basiertes Zeit-Tracking-Tool, mit dem du Aufgaben starten, pausieren und stoppen kannst. Die Einträge werden in einer JSON-Datei auf dem Server gespeichert und in einer Tabelle im Frontend dargestellt.

---

## Features

- Aufgaben starten, pausieren, stoppen
- Automatische Zeitmessung und Dauerberechnung (Wie lange wurde gearbeitet)
- Dropdown mit Vorschlägen für vorhandene Aufgaben
- Gruppierung der Einträge nach Datum und innerhalb eines Tages nach StartZeit
- Tages-Gesamtdauerberechnung

---

## Projektstruktur

```
project-root/
├── client/          # Frontend (React + TypeScript + TailwindCSS)
└── server/          # Backend (Node.js + Express)
```

---

## Lokale Entwicklung

### Voraussetzungen

- [Node.js](https://nodejs.org) installiert
- [npm](https://www.npmjs.com/) oder [yarn](https://yarnpkg.com/)

---

### Backend starten

```bash
cd server
npm install
npm run dev
```

Der Server läuft dann auf:  
 `http://localhost:3000`

---

### Frontend starten

```bash
cd client
npm install
npm run dev
```

Das Frontend läuft dann auf:  
 `http://localhost:5173`



---

## API

### `GET /entries`

Ruft alle gespeicherten Zeiteinträge ab.

### `POST /entries`

Speichert einen neuen Zeiteintrag.

**Beispiel-Anfrage:**

```json
{
  "id": 1714920000000,
  "taskName": "Time Tracker programmieren",
  "startTime": "2024-05-01T10:00:00.000Z",
  "endTime": "2024-05-01T10:30:00.000Z",
  "duration": "0:30"
}
```

