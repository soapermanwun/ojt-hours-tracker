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
import { ThemeSwitcher } from "@/components/theme-switcher";
import { toast } from "react-hot-toast";
import useAuthUser from "@/hooks/useAuthUser";

interface TimeEntry {
  id: number;
  date: string;
  morning_time_in: string;
  morning_time_out: string;
  afternoon_time_in: string;
  afternoon_time_out: string;
  evening_time_in: string;
  evening_time_out: string;
}

type NewTimeEntry = Omit<TimeEntry, "id">;

export default function Home() {
  const [requiredHours, setRequiredHours] = useState<number>(500);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user, userLoading } = useAuthUser();
  const [newEntry, setNewEntry] = useState<NewTimeEntry>({
    date: "",
    morning_time_in: "",
    morning_time_out: "",
    afternoon_time_in: "",
    afternoon_time_out: "",
    evening_time_in: "",
    evening_time_out: "",
  });

  const completionPercentage: number = Math.min(
    Math.round((completedHours / requiredHours) * 100),
    100
  );

  useEffect(() => {
    if (!localStorage.getItem("hours")) {
      localStorage.setItem("hours", requiredHours.toString());
    }

    async function fetchEntries() {
      const entries = await fetch(`/api/entries?created_by=${user?.id}`);

      const data = await entries.json();

      setLoading(false);
      setTimeEntries(data);
    }

    fetchEntries();

    setRequiredHours(Number(localStorage.getItem("hours")));
  }, [userLoading]);

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
        entry.morning_time_in,
        entry.morning_time_out
      );
      const afternoonHours = calculateHours(
        entry.afternoon_time_in,
        entry.afternoon_time_out
      );
      const eveningHours = calculateHours(
        entry.evening_time_in,
        entry.evening_time_out
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

  const handleAddEntry = async () => {
    if (!newEntry.date) {
      alert("Please select a date");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/entries", {
      method: "POST",
      body: JSON.stringify({ created_by: user?.id, ...newEntry }),
    });

    if (response.status != 201) {
      // TODO: Add some sort of error sanitization here
      toast.error("Error adding time entry");
      return;
    }

    const data: TimeEntry = await response.json();

    setTimeEntries((prev) => [...prev, { ...newEntry, id: data.id }]);

    toast.success("Added entry successfully");

    setIsSubmitting(false);

    setNewEntry({
      date: "",
      morning_time_in: "",
      morning_time_out: "",
      afternoon_time_in: "",
      afternoon_time_out: "",
      evening_time_in: "",
      evening_time_out: "",
    });
  };

  const handleDeleteEntry = async (id: number) => {
    const response = await fetch(`/api/entries/${id}?created_by=${user?.id}`, {
      method: "DELETE",
    });

    if (response.status != 204) {
      toast.error("Cannot delete entry");
      return;
    }

    toast.success("Deleted entry successfully");
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
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-center">
          OJT Hours Tracker
        </h1>
        <ThemeSwitcher />
      </div>

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
                <div className="absolute top-4 left-4 right-4 bottom-4 bg-primary rounded-full flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">
                    {completionPercentage}%
                  </span>
                  <span className="text-sm">Complete</span>
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
                      name="morning_time_in"
                      placeholder="Time In"
                      value={newEntry.morning_time_in}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="morning_time_out"
                      placeholder="Time Out"
                      value={newEntry.morning_time_out}
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
                      name="afternoon_time_in"
                      placeholder="Time In"
                      value={newEntry.afternoon_time_in}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="afternoon_time_out"
                      placeholder="Time Out"
                      value={newEntry.afternoon_time_out}
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
                      name="evening_time_in"
                      placeholder="Time In"
                      value={newEntry.evening_time_in}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time In</span>
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="time"
                      name="evening_time_out"
                      placeholder="Time Out"
                      value={newEntry.evening_time_out}
                      onChange={handleInputChange}
                    />
                    <span className="text-xs text-gray-500">Time Out</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              disabled={isSubmitting}
              className="w-full text-foreground"
              onClick={handleAddEntry}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <p>Add Time Entry</p>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Time Entry History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && userLoading && (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {timeEntries.length === 0 && !userLoading ? (
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
                  entry.morning_time_in,
                  entry.morning_time_out
                );
                const afternoonHours = calculateEntryHours(
                  entry.afternoon_time_in,
                  entry.afternoon_time_out
                );
                const eveningHours = calculateEntryHours(
                  entry.evening_time_in,
                  entry.evening_time_out
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
                      {entry.morning_time_in && (
                        <div>
                          <span className="font-medium">Morning:</span>{" "}
                          {entry.morning_time_in} - {entry.morning_time_out}
                          <span className="ml-2 text-gray-500">
                            ({morningHours.toFixed(2)} hrs)
                          </span>
                        </div>
                      )}

                      {entry.afternoon_time_in && (
                        <div>
                          <span className="font-medium">Afternoon:</span>{" "}
                          {entry.afternoon_time_in} - {entry.afternoon_time_out}
                          <span className="ml-2 text-gray-500">
                            ({afternoonHours.toFixed(2)} hrs)
                          </span>
                        </div>
                      )}

                      {entry.evening_time_in && (
                        <div>
                          <span className="font-medium">Evening:</span>{" "}
                          {entry.evening_time_in} - {entry.evening_time_out}
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
      <footer className="p-3 mt-10 text-center">
        <p className="text-sm">
          Built with NextJS + TailwindCSS by{" "}
          <span>
            <a
              className="underline hover:text-red-600"
              href="https://www.facebook.com/xxxjustentacion/"
            >
              Justine Ivan Gueco
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
}
