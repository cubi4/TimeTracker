import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TimeEntry {
    id: number;
    taskName: string;
    startTime: string;
    endTime: string;
    duration: string;
}

function App() {
    // connection to backend
    const [entries, setEntries] = useState<TimeEntry[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/entries") // Call backend's entries route
            .then((response) => response.json())
            .then((data) => setEntries(data))
            .catch((error) => console.error("Error fetching entries:", error));
    }, []);

    // define state variables
    const [taskName, setTaskName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null);

    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    //Timer Variables
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);






    return (
        <div className="flex justify-center items-center flex-col min-h-svh">
            {/* Timer Card */}
            <Card className="w-full max-w-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        Task Name
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    {/* Task Name Eingabefeld */}
                    <Input
                        placeholder="Task Name"
                        disabled={timerRunning}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    {/* Timer Anzeige */}
                    <div className="text-4xl text-center">
                        {timerRunning || isPaused
                            ? new Date(elapsedTime * 1000)
                                  .toISOString()
                                  .slice(11, 19)
                            : "00:00:00"}
                        {/* Start Button */}
                        {!timerRunning && (
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600"
                                disabled={!taskName}
                                onClick={() => {
                                    if (
                                        !timerRunning &&
                                        taskName &&
                                        !isPaused
                                    ) {
                                        setStartTime(new Date());
                                        setTimerRunning(true);
                                        setElapsedTime(0);

                                        timerRef.current = setInterval(() => {
                                            setElapsedTime((prev) => prev + 1);
                                        }, 1000);
                                    }
                                    if (isPaused) {
                                        setIsPaused(false);
                                        timerRef.current = setInterval(() => {
                                            setElapsedTime((prev) => prev + 1);
                                        }, 1000);
                                        setTimerRunning(true);
                                    }
                                }}
                            >
                                {isPaused ? "Resume" : "Start"}
                            </Button>
                        )}
                        {/* Pause Button */}
                        {timerRunning && !isPaused && (
                            <Button
                                className="w-full bg-yellow-500 hover:bg-yellow-600"
                                onClick={() => {
                                    if (timerRunning) {
                                        if (timerRef.current) {
                                            clearInterval(timerRef.current);
                                        }
                                        setTimerRunning(false);
                                        setIsPaused(true);
                                    }
                                }}
                            >
                                Pause
                            </Button>
                        )}

                        {/* Stop Button */}
                        {(timerRunning || isPaused) && (
                            <Button
                                className="w-full bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                    if (timerRunning) {
                                        if (timerRef.current) {
                                            clearInterval(timerRef.current);
                                        }
                                        setTimerRunning(false);
                                        setIsPaused(false);
                                    }
                                    const endTime = new Date();
                                    const duration = elapsedTime;

                                    const newEntry: TimeEntry = {
                                        id: Date.now(),
                                        taskName,
                                        startTime: startTime!.toISOString(),
                                        endTime: endTime.toISOString(),
                                        duration: `${Math.floor(
                                            duration / 3600
                                        )}h ${Math.floor(
                                            (duration % 3600) / 60
                                        )}m ${duration % 60}s`,
                                    };
                                    // POST the new entry to the backend
                                    fetch("http://localhost:3000/entries", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(newEntry),
                                    })
                                        .then((response) => {
                                            if (!response.ok)
                                                throw new Error(
                                                    "Failed to save entry"
                                                );
                                            return response;
                                        })
                                        .then((response) => response.json())
                                        .then((data) => {
                                            setEntries((prev) => [
                                                ...prev,
                                                data,
                                            ]);
                                            setTaskName("");
                                            setElapsedTime(0);
                                            setStartTime(null);
                                        })
                                        .catch((error) =>
                                            console.error(
                                                "Error posting entry:",
                                                error
                                            )
                                        );
                                }}
                            >
                                Stop
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* Past TIme Entries */}
            <Card className="w-full max-w-2xl shadow-md mt-6">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        Past Time Entries
                    </CardTitle>
                </CardHeader>

                <Table>
                    <TableHeader className="bg-purple-500">
                        <TableRow>
                            <TableHead className="text-center font-bold">
                                Task Name
                            </TableHead>
                            <TableHead className="text-center font-bold">
                                Start Time
                            </TableHead>
                            <TableHead className="text-center font-bold">
                                End Time
                            </TableHead>
                            <TableHead className="text-center font-bold">
                                Duration
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="text-center">
                                    {entry.taskName}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Date(entry.startTime)
                                        .toLocaleString()
                                        .slice(11, 16)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Date(entry.endTime)
                                        .toLocaleString()
                                        .slice(11, 16)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {entry.duration}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

export default App;
