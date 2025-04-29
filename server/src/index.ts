import express from "express";
import cors from "cors";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// define __dirname for ES modules
// __dirname and __filename are not available in ES modules, so we need to define them ourselves
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

//define interface for the data structure
interface TimeEntry {
    id: number;
    taskName: string;
    startTime: string;
    endTime: string;
    duration: string;
}

//define path to the JSON file
const dataFilePath = path.join(__dirname, "entries.json");

//Functions
function formatDuration(seconds: number): string {
    // returns Duration in a hh:mm format
    const effectiveSeconds = Math.max(seconds, 60); // round to at least 1 minute
    const totalMinutes = Math.floor(effectiveSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(1, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}`;
}

//GET
app.get("/entries", (req, res) => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, "[]");
    }
    const entries = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    res.json(entries);
});

//POST
app.post("/entries", (req, res) => {
    const { id, taskName, startTime, endTime, duration } = req.body;

    const newEntry: TimeEntry = {
        id: id || Date.now(), // Use current timestamp as ID if not provided
        taskName,
        startTime,
        endTime,
        duration: formatDuration(duration),
    };

    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, "[]");
    }
    const entries = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    entries.push(newEntry);
    fs.writeFileSync(dataFilePath, JSON.stringify(entries, null, 2), "utf-8");
    res.status(201).json(newEntry);
});

//Listen on port 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
