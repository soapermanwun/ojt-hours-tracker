"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeEntry {
  id: number;
  date: string;
  morningTimeIn: string;
  morningTimeOut: string;
  afternoonTimeIn: string;
  afternoonTimeOut: string;
  eveningTimeIn: string;
  eveningTimeOut: string;
}

type NewTimeEntry = Omit<TimeEntry, "id">;

export default function Home() {
  const [requiredHours, setRequiredHours] = useState<number>(500);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const [newEntry, setNewEntry] = useState<NewTimeEntry>({
    date: "",
    morningTimeIn: "",
    morningTimeOut: "",
    afternoonTimeIn: "",
    afternoonTimeOut: "",
    eveningTimeIn: "",
    eveningTimeOut: "",
  });

  const completionPercentage: number = Math.min(
    Math.round((completedHours / requiredHours) * 100),
    100
  );

  useEffect(() => {
    if (!localStorage.getItem("hours")) {
      localStorage.setItem("hours", requiredHours.toString());
    }

    if (!localStorage.getItem("entries")) {
      localStorage.setItem("entries", JSON.stringify(timeEntries));
    }

    setRequiredHours(Number(localStorage.getItem("hours")));

    const entriesStorage = localStorage.getItem("entries");

    if (!entriesStorage) {
      return;
    }

    const parsedEntries: TimeEntry[] = JSON.parse(entriesStorage);

    setTimeEntries(parsedEntries);
  }, []);

  useEffect(() => {
    let totalHours = 0;

    timeEntries.forEach((entry) => {
      const calculateHours = (timeIn: string, timeOut: string): number => {
        if (!timeIn || !timeOut) return 0;

        const [inHour, inMinute] = timeIn.split(":").map(Number);
        const [outHour, outMinute] = timeOut.split(":").map(Number);

        const inMinutes = inHour * 60 + inMinute;
        const outMinutes = outHour * 60 + outMinute;

        return Math.max(0, (outMinutes - inMinutes) / 60);
      };

      const morningHours = calculateHours(
        entry.morningTimeIn,
        entry.morningTimeOut
      );
      const afternoonHours = calculateHours(
        entry.afternoonTimeIn,
        entry.afternoonTimeOut
      );
      const eveningHours = calculateHours(
        entry.eveningTimeIn,
        entry.eveningTimeOut
      );

      totalHours += morningHours + afternoonHours + eveningHours;
    });

    localStorage.setItem("entries", JSON.stringify(timeEntries));

    setCompletedHours(parseFloat(totalHours.toFixed(2)));
  }, [timeEntries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequiredHoursChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value) || 0;
    localStorage.setItem("hours", value.toString());
    setRequiredHours(value);
  };

  const handleAddEntry = (): void => {
    if (!newEntry.date) {
      alert("Please select a date");
      return;
    }

    setTimeEntries((prev) => [...prev, { ...newEntry, id: Date.now() }]);

    setNewEntry({
      date: "",
      morningTimeIn: "",
      morningTimeOut: "",
      afternoonTimeIn: "",
      afternoonTimeOut: "",
      eveningTimeIn: "",
      eveningTimeOut: "",
    });
  };

  const handleDeleteEntry = (id: number): void => {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const calculateEntryHours = (timeIn: string, timeOut: string): number => {
    if (!timeIn || !timeOut) return 0;

    const [inHour, inMinute] = timeIn.split(":").map(Number);
    const [outHour, outMinute] = timeOut.split(":").map(Number);

    const inMinutes = inHour * 60 + inMinute;
    const outMinutes = outHour * 60 + outMinute;

    return Math.max(0, (outMinutes - inMinutes) / 60);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">OJT Hours Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">OJT Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(
                    #3b82f6 ${completionPercentage}%, 
                    #e5e7eb ${completionPercentage}%
                  )`,
                }}
              >
                <div className="absolute top-4 left-4 right-4 bottom-4 bg-white rounded-full flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">
                    {completionPercentage}%
                  </span>
                  <span className="text-gray-500 text-sm">Complete</span>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full">
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex justify-between text-sm mt-2">
                <span>{completedHours} hours completed</span>
                <span>{requiredHours} hours required</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Label htmlFor="requiredHours">Total Required Hours:</Label>
              <Input
                id="requiredHours"
                type="number"
                value={requiredHours}
                onChange={handleRequiredHoursChange}
                className="mt-1"
              />
            </div>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Record Time Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Morning
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="morningTimeIn"
                      placeholder="Time In"
                      value={newEntry.morningTimeIn}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="morningTimeOut"
                      placeholder="Time Out"
                      value={newEntry.morningTimeOut}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time Out</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Afternoon
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="afternoonTimeIn"
                      placeholder="Time In"
                      value={newEntry.afternoonTimeIn}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="afternoonTimeOut"
                      placeholder="Time Out"
                      value={newEntry.afternoonTimeOut}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time Out</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Evening (Optional)
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="eveningTimeIn"
                      placeholder="Time In"
                      value={newEntry.eveningTimeIn}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="eveningTimeOut"
                      placeholder="Time Out"
                      value={newEntry.eveningTimeOut}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time Out</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAddEntry}>
              Add Time Entry
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Time Entry History</CardTitle>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No time entries yet. Add your first entry using the form above.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {timeEntries.map((entry, index) => {
                const morningHours = calculateEntryHours(
                  entry.morningTimeIn,
                  entry.morningTimeOut
                );
                const afternoonHours = calculateEntryHours(
                  entry.afternoonTimeIn,
                  entry.afternoonTimeOut
                );
                const eveningHours = calculateEntryHours(
                  entry.eveningTimeIn,
                  entry.eveningTimeOut
                );
                const totalHours = morningHours + afternoonHours + eveningHours;

                return (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <span className="font-bold text-blue-600">
                        {totalHours.toFixed(2)} hours
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {entry.morningTimeIn && (
                        <div>
                          <span className="font-medium">Morning:</span>{" "}
                          {entry.morningTimeIn} - {entry.morningTimeOut}
                          <span className="ml-2 text-gray-500">
                            ({morningHours.toFixed(2)} hrs)
                          </span>
                        </div>
                      )}

                      {entry.afternoonTimeIn && (
                        <div>
                          <span className="font-medium">Afternoon:</span>{" "}
                          {entry.afternoonTimeIn} - {entry.afternoonTimeOut}
                          <span className="ml-2 text-gray-500">
                            ({afternoonHours.toFixed(2)} hrs)
                          </span>
                        </div>
                      )}

                      {entry.eveningTimeIn && (
                        <div>
                          <span className="font-medium">Evening:</span>{" "}
                          {entry.eveningTimeIn} - {entry.eveningTimeOut}
                          <span className="ml-2 text-gray-500">
                            ({eveningHours.toFixed(2)} hrs)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        Delete
                      </Button>
                    </div>

                    {index < timeEntries.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
