"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Calendar, Clock } from "lucide-react";

import { NewTimeEntry, TimeEntry } from "@/utils/types";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { EntryContext } from "./EntryContext";
import useAuthUser from "@/hooks/useAuthUser";

export default function EntriesCard({
  index,
  entry,
  morningHours,
  afternoonHours,
  eveningHours,
  totalHours,
}: {
  index: number;
  entry: TimeEntry;
  morningHours: number;
  afternoonHours: number;
  eveningHours: number;
  totalHours: number;
}) {
  const entryContext = useContext(EntryContext);
  const { user } = useAuthUser();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [updateEntry, setUpdateEntry] = useState<NewTimeEntry>({
    date: "",
    morning_time_in: "",
    morning_time_out: "",
    afternoon_time_in: "",
    afternoon_time_out: "",
    evening_time_in: "",
    evening_time_out: "",
  });

  const handleUpdateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setUpdateEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEntry = async (id: number) => {
    if (!updateEntry.date) {
      alert("Please select a date");
      return;
    }
    try {
      const response = await fetch(
        `/api/entries/${id}?created_by=${user?.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updateEntry),
        }
      );

      if (response.status != 204) {
        // TODO: Add some sort of error sanitization here
        toast.error("Error adding time entry");
        return;
      }

      if (response.ok) {
        entryContext!.setTimeEntries((prevTimeEntries) =>
          prevTimeEntries.map((item) =>
            item.id === id ? { ...item, ...updateEntry } : item
          )
        );

        toast.success("Entry updated successfully");
      }
    } catch (error) {
      alert(error);
    } finally {
      setUpdateEntry({
        date: "",
        morning_time_in: "",
        morning_time_out: "",
        afternoon_time_in: "",
        afternoon_time_out: "",
        evening_time_in: "",
        evening_time_out: "",
      });
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/entries/${id}?created_by=${user?.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status != 204) {
        toast.error("Cannot delete entry");
        return;
      }

      if (response.ok) {
        toast.success("Deleted entry successfully");
        entryContext!.setTimeEntries((prev) =>
          prev.filter((entry) => entry.id !== id)
        );
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
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

        <div className="mt-2 flex justify-end gap-3 items-center">
          <Sheet key={index}>
            <SheetTrigger asChild>
              <Button
                onClick={() =>
                  setUpdateEntry({
                    date: entry.date,
                    afternoon_time_in: entry.afternoon_time_in,
                    afternoon_time_out: entry.afternoon_time_out,
                    evening_time_in: entry.evening_time_in,
                    evening_time_out: entry.evening_time_out,
                    morning_time_in: entry.morning_time_in,
                    morning_time_out: entry.morning_time_out,
                  })
                }
                variant="secondary"
              >
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Time History</SheetTitle>
                <SheetDescription>
                  Edit your time history here and click Submit to save changes.
                </SheetDescription>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={updateEntry.date}
                      onChange={handleUpdateInputChange}
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
                          value={updateEntry.morning_time_in}
                          onChange={handleUpdateInputChange}
                        />
                        <span className="text-xs text-gray-500">Time In</span>
                      </div>
                      <div className="w-1/2">
                        <Input
                          type="time"
                          name="morning_time_out"
                          placeholder="Time Out"
                          value={updateEntry.morning_time_out}
                          onChange={handleUpdateInputChange}
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
                          value={updateEntry.afternoon_time_in}
                          onChange={handleUpdateInputChange}
                        />
                        <span className="text-xs text-gray-500">Time In</span>
                      </div>
                      <div className="w-1/2">
                        <Input
                          type="time"
                          name="afternoon_time_out"
                          placeholder="Time Out"
                          value={updateEntry.afternoon_time_out}
                          onChange={handleUpdateInputChange}
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
                          value={updateEntry.evening_time_in}
                          onChange={handleUpdateInputChange}
                        />
                        <span className="text-xs text-gray-500">Time In</span>
                      </div>
                      <div className="w-1/2">
                        <Input
                          type="time"
                          name="evening_time_out"
                          placeholder="Time Out"
                          value={updateEntry.evening_time_out}
                          onChange={handleUpdateInputChange}
                        />
                        <span className="text-xs text-gray-500">Time Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    onClick={() => handleUpdateEntry(entry.id)}
                    variant="outline"
                    type="submit"
                  >
                    Submit
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Button
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteEntry(entry.id)}
          >
            {isDeleting ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <p>Delete</p>
            )}
          </Button>
        </div>

        {index < entryContext!.timeEntries.length - 1 && (
          <Separator className="mt-4" />
        )}
      </div>
    </div>
  );
}
