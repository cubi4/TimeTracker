import "./App.css";
import { useEffect, useState, useRef } from "react";
import { PastEntries } from "./components/PastEntries";
import { TimerCard } from "./components/TimerCard";

interface TimeEntry {
    id: number;
    taskName: string;
    startTime: string;
    endTime: string;
    duration: number;
}

function App() {
    // connection to backend
    const [entries, setEntries] = useState<TimeEntry[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/entries") // Call backend's entries route
            .then((response) => response.json())
            .then((data) => setEntries(data))
            .catch((error) => {
                console.error("Error fetching entries:", error);
                alert(
                    "Error fetching entries. Please check the backend server."
                );
            });
    }, []);

    // VARIABLES
    //Task Variables
    const [taskName, setTaskName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null);

    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    //Timer Variables
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const taskNameSuggestions = getUniqueTaskNames(entries);

    // FUNCTIONS
    function getUniqueTaskNames(entries: TimeEntry[]): string[] {
        const names = entries.map((e) => e.taskName);
        return Array.from(new Set(names));
    }

    function groupEntriesByDate(entries: TimeEntry[]) {
        const groups: Record<string, TimeEntry[]> = {};

        for (const entry of entries) {
            const date = new Date(entry.startTime).toLocaleDateString("de-DE");

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(entry);
        }
        return groups;
    }

    function getSortedGroupedEntries(entries: TimeEntry[]) {
        const grouped = groupEntriesByDate(entries);

        //sort each group by startTime in descending order
        for (const date in grouped) {
            grouped[date].sort(
                (a, b) =>
                    new Date(b.startTime).getTime() -
                    new Date(a.startTime).getTime()
            );
        }
        //sort the groups by date in descending order
        const sorted = Object.entries(grouped).sort(([dateA], [dateB]) => {
            const a = new Date(dateA.split(".").reverse().join("-")).getTime();
            const b = new Date(dateB.split(".").reverse().join("-")).getTime();
            return b - a; // latest first
        });

        return sorted;
    }

    // Button handlers
    function handleStart() {
        setStartTime(new Date());
        setTimerRunning(true);
        setElapsedTime(0);

        timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    }

    function handlePause() {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerRunning(false);
        setIsPaused(true);
    }

    function handleResume() {
        setIsPaused(false);
        setTimerRunning(true);

        timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    }

    function handleStop() {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerRunning(false);
        setIsPaused(false);

        const endTime = new Date();
        const newEntry: TimeEntry = {
            id: Date.now(),
            taskName,
            startTime: startTime ? startTime.toISOString() : "",
            endTime: endTime.toISOString(),
            duration: elapsedTime,
        };

        fetch("http://localhost:3000/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEntry),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Fehler beim Speichern");
                return response.json();
            })
            .then((data) => {
                setEntries((prev) => [data, ...prev]);
                setTaskName("");
                setElapsedTime(0);
                setStartTime(null);
            })
            .catch((error) => {
                console.error("Fehler beim Speichern:", error);
                alert("Speichern fehlgeschlagen.");
            });
    }

    const groupedEntries = getSortedGroupedEntries(entries);
    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <div className="bg-slate-100/100 p-8 rounded-xl shadow-2xl mb-8">
                <div className="flex justify-center items-center flex-col min-h-svh">
                    <TimerCard
                        taskName={taskName}
                        setTaskName={setTaskName}
                        timerRunning={timerRunning}
                        isPaused={isPaused}
                        elapsedTime={elapsedTime}
                        onStart={handleStart}
                        onPause={handlePause}
                        onResume={handleResume}
                        onStop={handleStop}
                        taskNameSuggestions={taskNameSuggestions}
                    />
                    <PastEntries groupedEntries={groupedEntries} />
                </div>
            </div>
        </div>
    );
}

export default App;
