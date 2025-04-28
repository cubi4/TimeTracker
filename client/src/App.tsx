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

    return (
        <div className="flex justify-center items-center flex-col min-h-svh">
            <h1 className="text-4xl">Entries from Backend:</h1>

            {/* output (Testing) */}
            <ul className="mb-6">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        {entry.taskName} - {entry.startTime} to {entry.endTime}{" "}
                        ({entry.duration})
                    </li>
                ))}
            </ul>

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
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    {/* Timer Anzeige */}
                    <div className="text-4xl text-center">
                        {timerRunning
                            ? new Date(elapsedTime * 1000)
                                  .toISOString()
                                  .slice(11, 19)
                            : "00:00:00"}
                        {/* Start Button */}
                        <Button
                            className="w-full"
                            disabled={!taskName || timerRunning}
                            onClick={() => {
                                if (!timerRunning && taskName) {
                                    setStartTime(new Date());
                                    setTimerRunning(true);

                                    timerRef.current = setInterval(() => {
                                        setElapsedTime((prev) => prev + 1);
                                    }, 1000);
                                }
                            }}
                        >
                            {timerRunning ? "Running..." : "Start"}
                        </Button>
                    </div>
                    {/* Stop Button */}
                    {timerRunning && (
                        <Button
                            className="w-full bg-red-500 hover:bg-red-600"
                            onClick={() => {
                                if (timerRunning) {
                                    if (timerRef.current) {
                                        clearInterval(timerRef.current);
                                    }
                                    setTimerRunning(false);
                                }
                            }}
                        >
                            Stop
                        </Button>
                    )}
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
                        <TableRow>
                            <TableCell className="text-center">
                                Example Task
                            </TableCell>
                            <TableCell className="text-center">10:30</TableCell>
                            <TableCell className="text-center">11:30</TableCell>
                            <TableCell className="text-center">1h</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">
                                Example Task
                            </TableCell>
                            <TableCell className="text-center">10:30</TableCell>
                            <TableCell className="text-center">11:30</TableCell>
                            <TableCell className="text-center">1h</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">
                                Example Task
                            </TableCell>
                            <TableCell className="text-center">10:30</TableCell>
                            <TableCell className="text-center">11:30</TableCell>
                            <TableCell className="text-center">1h</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

export default App;
