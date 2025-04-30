import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        duration: string | number;
}

interface PastEntriesProps {
        groupedEntries: [string, TimeEntry[]][];
}

export function PastEntries(props: PastEntriesProps) {
        const groupedEntries = props.groupedEntries;
        return (
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
                                        className="w-full max-w-xl mt-6 border-0 shadow-md bg-white"
                                >
                                        <CardHeader>
                                                <CardTitle className="text-xl semibold flex items-center gap-2 text-gray-700">
                                                        <Calendar className="w-5 h-5 mr-1 text-emerald-500" />
                                                        {date}
                                                </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                                <Table>
                                                        <TableHeader className="bg-emerald-600">
                                                                <TableRow className="hover:bg-transparent cursor-default">
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
                                                                                        ).toLocaleTimeString("de-DE", {
                                                                                                hour: "2-digit",
                                                                                                minute: "2-digit",
                                                                                        })}
                                                                                </TableCell>
                                                                                <TableCell className="text-center text-emerald-600">
                                                                                        {new Date(
                                                                                                entry.endTime
                                                                                        ).toLocaleTimeString("de-DE", {
                                                                                                hour: "2-digit",
                                                                                                minute: "2-digit",
                                                                                        })}
                                                                                </TableCell>
                                                                                <TableCell className="text-center">
                                                                                        {entry.duration} h
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ))}
                                                        </TableBody>
                                                </Table>
                                        </CardContent>
                                </Card>
                        ))}
                </div>
        );
}
