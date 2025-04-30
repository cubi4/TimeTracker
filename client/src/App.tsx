import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play, Pause, StopCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
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

    // define state variables
    const [taskName, setTaskName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null);

    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    //Timer Variables
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    //functions
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
        const sorted = Object.entries(grouped)
            .sort(([dateA], [dateB]) => {
                const a = new Date(
                    dateA.split(".").reverse().join("-")
                ).getTime();
                const b = new Date(
                    dateB.split(".").reverse().join("-")
                ).getTime();
                return b - a; // latest first
            });

        return sorted;
    }

    const groupedEntries = getSortedGroupedEntries(entries);
    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <div className="bg-slate-100/100 p-8 rounded-xl shadow-2xl mb-8">
                <div className="flex justify-center items-center flex-col min-h-svh">
                    {/* Timer Card */}
                    <Card className="w-full max-w-xl border-0 shadow-md bg-white">
                        <CardHeader className="bg-emerald-600 text-white p-4">
                            <CardTitle className="text-2xl flex gap-2 ">
                                <Clock className="w-6 h-6 text-emerald-400" />
                                <span className="leading-none">Task Name</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6">
                            {/* TASKNAME INPUT */}
                            <Input
                                className="text-large font-semibold! py-5 border-2 border-emerald-600 focus:border-emerald-400! focus:ring-0!"
                                placeholder="Task A"
                                maxLength={40}
                                disabled={timerRunning}
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                            {/* TIMER DISPLAY */}
                            <div
                                className={`text-5xl text-center bg-emerald-100 text-blue-700 p-6 rounded-lg shadow-inner font-mono tracking-widest  transition-colors duration-500 ${
                                    timerRunning
                                        ? "bg-emerald-50 text-emerald-600"
                                        : isPaused
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {timerRunning || isPaused
                                    ? new Date(elapsedTime * 1000)
                                          .toISOString()
                                          .slice(11, 19)
                                    : "00:00:00"}
                            </div>
                            <div className="flex justify-center w-full space-x-4 gap-4">
                                {/* START BUTTON */}
                                {!timerRunning && !isPaused && (
                                    <Button
                                        className="h-12 w-1/2 text-lg bg-emerald-500 hover:bg-emerald-700"
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

                                                timerRef.current = setInterval(
                                                    () => {
                                                        setElapsedTime(
                                                            (prev) => prev + 1
                                                        );
                                                    },
                                                    1000
                                                );
                                            }
                                        }}
                                    >
                                        <Play className="w-6 h-6" />
                                        Start
                                    </Button>
                                )}
                                {/* RESUME BUTTON */}
                                {isPaused && (
                                    <Button
                                        className="h-12 w-1/4 border-transparent border-2 text-lg bg-emerald-500 hover:bg-emerald-700"
                                        onClick={() => {
                                            setIsPaused(false);
                                            timerRef.current = setInterval(
                                                () => {
                                                    setElapsedTime(
                                                        (prev) => prev + 1
                                                    );
                                                },
                                                1000
                                            );
                                            setTimerRunning(true);
                                        }}
                                    >
                                        <Play className="w-6 h-6" />
                                        Resume
                                    </Button>
                                )}
                                {/* PAUSE BUTTON */}
                                {timerRunning && !isPaused && (
                                    <Button
                                        className="h-12 w-1/4 border-2 border-violet-400 text-violet-600 text-lg bg-transparent hover:bg-violet-50 hover:text-violet-700"
                                        onClick={() => {
                                            if (timerRunning) {
                                                if (timerRef.current) {
                                                    clearInterval(
                                                        timerRef.current
                                                    );
                                                }
                                                setTimerRunning(false);
                                                setIsPaused(true);
                                            }
                                        }}
                                    >
                                        <Pause className="w-6 h-6" />
                                        Pause
                                    </Button>
                                )}

                                {/* STOP BUTTON */}
                                {(timerRunning || isPaused) && (
                                    <Button
                                        className="h-12 w-1/4 border-2 border-transparent text-lg bg-rose-600 hover:bg-rose-800"
                                        onClick={() => {
                                            if (timerRunning) {
                                                if (timerRef.current) {
                                                    clearInterval(
                                                        timerRef.current
                                                    );
                                                }
                                                setTimerRunning(false);
                                                setIsPaused(false);
                                            }
                                            const endTime = new Date();
                                            const newEntry: TimeEntry = {
                                                id: Date.now(),
                                                taskName,
                                                startTime:
                                                    startTime!.toISOString(),
                                                endTime: endTime.toISOString(),
                                                duration: elapsedTime,
                                            };
                                            // POST the new entry to the backend
                                            fetch(
                                                "http://localhost:3000/entries",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    body: JSON.stringify(
                                                        newEntry
                                                    ),
                                                }
                                            )
                                                .then((response) => {
                                                    if (!response.ok)
                                                        throw new Error(
                                                            "Failed to save entry"
                                                        );
                                                    return response;
                                                })
                                                .then((response) =>
                                                    response.json()
                                                )
                                                .then((data) => {
                                                    setEntries((prev) => [
                                                        data,
                                                        ...prev,
                                                    ]);
                                                    setTaskName("");
                                                    setElapsedTime(0);
                                                    setStartTime(null);
                                                    setIsPaused(false);
                                                    setTimerRunning(false);
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "Error posting entry:",
                                                        error
                                                    );
                                                    alert(
                                                        "Error posting entry. Please check the backend server."
                                                    );
                                                });
                                        }}
                                    >
                                        <StopCircle className="w-6 h-6" />
                                        Stop
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Past TIme Entries */}
                    <div className="w-full max-w-xl mt-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block w-3 h-8 bg-emerald-500 rounded"></span>
                            <h2 className="text-xl font-bold text-gray-800">
                                Past Entries
                            </h2>
                        </div>
                        {groupedEntries.map(([date, dayEntries]) => (
                            <Card
                                key={date}
                                className="w-full max-w-xl mt-6 border-0 shadow-md bg-white "
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl semibold flex items-center gap-2 text-gray-700">
                                        <Calendar className="w-5 h-5 mr-1 text-emerald-500 " />
                                        {date}
                                    </CardTitle>
                                </CardHeader>
                                <Table>
                                    <TableHeader className="bg-emerald-600 ">
                                        <TableRow className="hover:bg-transparent cursor-default w-full">
                                            <TableHead className="text-center text-white font-bold min-w-[50%]">
                                                Task Name
                                            </TableHead>
                                            <TableHead className="text-center text-white font-bold">
                                                Start Time
                                            </TableHead>
                                            <TableHead className="text-center text-white font-bold">
                                                End Time
                                            </TableHead>
                                            <TableHead className="text-center text-white font-bold">
                                                Duration
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dayEntries.map((entry) => (
                                            <TableRow
                                                key={entry.id}
                                                className="hover:bg-emerald-200 cursor-default"
                                            >
                                                <TableCell className="text-center">
                                                    {entry.taskName}
                                                </TableCell>
                                                <TableCell className="text-center text-emerald-600">
                                                    {new Date(
                                                        entry.startTime
                                                    ).toLocaleTimeString(
                                                        "de-DE",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center text-emerald-600">
                                                    {new Date(
                                                        entry.endTime
                                                    ).toLocaleTimeString(
                                                        "de-DE",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {entry.duration} h
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
