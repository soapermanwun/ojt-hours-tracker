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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { TimeEntry } from "@/utils/types";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { EntryContext } from "./EntryContext";
import useAuthUser from "@/hooks/useAuthUser";
import useEntryForm from "@/hooks/useEntryForm";
import EntryForm from "./EntryForm";
import { actionDeleteEntry, actionUpdateEntry } from "../actions";

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
  const {
    entryValue,
    setEntryValue,
    handleInputChange,
    isSubmitting,
    setIsSubmitting,
  } = useEntryForm();
  const entryContext = useContext(EntryContext);
  const { user } = useAuthUser();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleUpdateEntry = async (id: number) => {
    if (!entryValue.date) {
      alert("Please select a date");
      return;
    }

    if (!user?.id) {
      toast.error("Unexpected error occured");
      return;
    }

    setIsSubmitting(true);

    const { ok } = await actionUpdateEntry(id, user.id, entryValue);

    if (!ok) {
      toast.error("Error adding time entry");
      return;
    }

    if (ok) {
      entryContext!.setTimeEntries((prevTimeEntries) =>
        prevTimeEntries.map((item) =>
          item.id === id ? { ...item, ...entryValue } : item
        )
      );

      toast.success("Entry updated successfully");
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!user?.id) {
      toast.error("Error deleting entry");
      return;
    }

    setIsDeleting(true);

    const { ok } = await actionDeleteEntry(id, user.id);

    if (!ok) {
      toast.error("Cannot delete entry");
      return;
    }

    if (ok) {
      toast.success("Deleted entry successfully");
      entryContext!.setTimeEntries((prev) =>
        prev.filter((entry) => entry.id !== id)
      );
    }

    setIsDeleting(false);
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
                  setEntryValue({
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
              </SheetHeader>
              <EntryForm
                data={entryValue}
                handleInputChange={handleInputChange}
                isSubmitting={isSubmitting}
                isUpdate={true}
                handleUpdateEntry={() => handleUpdateEntry(entry.id)}
              />
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    disabled={isSubmitting}
                    variant="outline"
                    type="submit"
                  >
                    Close
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
