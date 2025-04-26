import "./App.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";


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
        </div>
    );
}

export default App;
