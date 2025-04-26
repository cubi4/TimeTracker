import "./App.css";
import { useEffect, useState } from "react";
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

function App() {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/") // Call backend's Hello World route
            .then((response) => response.text())
            .then((data) => setMessage(data))
            .catch((error) => console.error("Error fetching message:", error));
    }, []);

    return (
        <div className="flex justify-center items-center flex-col min-h-svh">
            <h1 className="text-4xl">Message from Backend:</h1>
            <p className="text-purple">{message}</p>

            {/* Timer Card */}
            <Card className="w-full max-w-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        Task Name
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    {/* Task Name Eingabefeld */}
                    <Input placeholder="Task Name" />
                    {/* Timer Anzeige */}
                    <div className="text-4xl font-bold text-center">00:00</div>
                    {/* Start Button */}
                    <Button className="w-full">Start</Button>
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
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

export default App;
