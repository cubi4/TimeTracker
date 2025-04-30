import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play, Pause, StopCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TimerCardProps {
        taskName: string;
        setTaskName: (value: string) => void;
        timerRunning: boolean;
        isPaused: boolean;
        elapsedTime: number;
        onStart: () => void;
        onPause: () => void;
        onResume: () => void;
        onStop: () => void;
}

export function TimerCard(props: TimerCardProps) {
        const taskName = props.taskName;
        const setTaskName = props.setTaskName;
        const timerRunning = props.timerRunning;
        const isPaused = props.isPaused;
        const elapsedTime = props.elapsedTime;
        const onStart = props.onStart;
        const onPause = props.onPause;
        const onResume = props.onResume;
        const onStop = props.onStop;

        return (
                <Card className="w-full max-w-xl border-0 shadow-md bg-white">
                        <CardHeader className="bg-emerald-600 text-white p-4">
                                <CardTitle className="text-2xl flex gap-2 ">
                                        <Clock className="w-6 h-6 text-emerald-400" />
                                        <span className="leading-none">Task Name</span>
                                </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-6">
                                <Input
                                        className="text-large font-semibold! py-5 border-2 border-emerald-600 focus:border-emerald-400! focus:ring-0!"
                                        placeholder="Task A"
                                        maxLength={40}
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                />

                                <div
                                        className={`text-5xl text-center bg-emerald-100 text-blue-700 p-6 rounded-lg shadow-inner font-mono tracking-widest transition-colors duration-500 ${timerRunning
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
                                                        onClick={onStart}
                                                >
                                                        <Play className="w-6 h-6" />
                                                        Start
                                                </Button>
                                        )}
                                        {/* RESUME BUTTON */}
                                        {isPaused && (
                                                <Button
                                                        className="h-12 w-1/4 border-transparent border-2 text-lg bg-emerald-500 hover:bg-emerald-700"
                                                        onClick={onResume}
                                                >
                                                        <Play className="w-6 h-6" />
                                                        Resume
                                                </Button>
                                        )}
                                        {/* PAUSE BUTTON */}
                                        {timerRunning && !isPaused && (
                                                <Button
                                                        className="h-12 w-1/4 border-2 border-violet-400 text-violet-600 text-lg bg-transparent hover:bg-violet-50 hover:text-violet-700"
                                                        onClick={onPause}
                                                >
                                                        <Pause className="w-6 h-6" />
                                                        Pause
                                                </Button>
                                        )}
                                        {/* STOP BUTTON */}
                                        {(timerRunning || isPaused) && (
                                                <Button
                                                        className="h-12 w-1/4 border-2 border-transparent text-lg bg-rose-600 hover:bg-rose-800"
                                                        onClick={onStop}
                                                >
                                                        <StopCircle className="w-6 h-6" />
                                                        Stop
                                                </Button>
                                        )}
                                </div>
                        </CardContent>
                </Card>
        );
}
