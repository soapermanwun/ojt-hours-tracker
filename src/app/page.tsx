"use client";

import React, { useState, useEffect, useContext } from "react";
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
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "react-hot-toast";
import useAuthUser from "@/hooks/useAuthUser";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { calculateEntryHours } from "./modules/entries/helpers";
import { EntryContext } from "./modules/entries/components/EntryContext";
import EntriesCard from "./modules/entries/components/EntriesCard";
import useEntryForm from "@/hooks/useEntryForm";
import EntryForm from "./modules/entries/components/EntryForm";
import { actionCreateEntry, actionGetEntries } from "./modules/entries/actions";

export default function Home() {
  const {
    entryValue,
    setEntryValue,
    handleInputChange,
    isSubmitting,
    setIsSubmitting,
  } = useEntryForm();

  const entryContext = useContext(EntryContext);
  const [requiredHours, setRequiredHours] = useState<number>(500);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, userLoading } = useAuthUser();

  const completionPercentage: number = Math.min(
    Math.round((completedHours / requiredHours) * 100),
    100
  );

  useEffect(() => {
    if (!localStorage.getItem("hours")) {
      localStorage.setItem("hours", requiredHours.toString());
    }

    async function fetchEntries() {
      if (!user?.id) {
        return;
      }

      const { ok, data } = await actionGetEntries(user.id);

      if (!ok) {
        toast.error("Error fetching entries");
        return;
      }

      if (!data) {
        toast.error("Error fetching entries");
        return;
      }

      setLoading(false);
      entryContext!.setTimeEntries(
        data.map((entry) => ({
          ...entry,
          evening_time_in: entry.evening_time_in ?? "",
          evening_time_out: entry.evening_time_out ?? "",
        }))
      );
    }

    fetchEntries();

    setRequiredHours(Number(localStorage.getItem("hours")));
  }, [userLoading]);

  useEffect(() => {
    let totalHours = 0;

    entryContext!.timeEntries.forEach((entryValue) => {
      const morningHours = calculateEntryHours(
        entryValue.morning_time_in,
        entryValue.morning_time_out
      );
      const afternoonHours = calculateEntryHours(
        entryValue.afternoon_time_in,
        entryValue.afternoon_time_out
      );
      const eveningHours = calculateEntryHours(
        entryValue.evening_time_in,
        entryValue.evening_time_out
      );

      totalHours += morningHours + afternoonHours + eveningHours;
    });

    localStorage.setItem("entries", JSON.stringify(entryContext!.timeEntries));

    setCompletedHours(parseFloat(totalHours.toFixed(2)));
  }, [entryContext!.timeEntries]);

  const handleRequiredHoursChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value) || 0;
    localStorage.setItem("hours", value.toString());
    setRequiredHours(value);
  };

  const handleAddEntry = async () => {
    if (!entryValue.date) {
      alert("Please select a date");
      return;
    }

    setIsSubmitting(true);

    const { ok, data } = await actionCreateEntry(user!.id, entryValue);

    if (!ok) {
      toast.error("Error creating entry");
      return;
    }

    if (!data) {
      toast.error("Error creating entry");
      return;
    }

    entryContext!.setTimeEntries((prev) => [
      ...prev,
      { ...entryValue, id: data.id },
    ]);

    toast.success("Added entry successfully");

    setIsSubmitting(false);

    setEntryValue({
      date: "",
      morning_time_in: "",
      morning_time_out: "",
      afternoon_time_in: "",
      afternoon_time_out: "",
      evening_time_in: "",
      evening_time_out: "",
    });
  };

  const onClickLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    location.reload();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-center">
          OJT Hours Tracker
        </h1>
        <div className="flex gap-3 items-center justify-center">
          <ThemeSwitcher />
          {userLoading ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  width={100}
                  height={100}
                  src={user?.user_metadata.avatar_url}
                  alt="user pic"
                  className="h-8 w-8 rounded-full"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-center">
                  <Button onClick={onClickLogout}>Logout</Button>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
              <p className="text-sm">
                Remaining Hours: {requiredHours - completedHours}
              </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Record Time Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <EntryForm
              data={entryValue}
              handleInputChange={handleInputChange}
              isSubmitting={isSubmitting}
              isUpdate={false}
              handleAddEntry={handleAddEntry}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Time Entry History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {entryContext!.timeEntries.length === 0 && !loading ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No time entries yet. Add your first entryValue using the form
                above.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {entryContext!.timeEntries.map((entryValue, index) => {
                const morningHours = calculateEntryHours(
                  entryValue.morning_time_in,
                  entryValue.morning_time_out
                );
                const afternoonHours = calculateEntryHours(
                  entryValue.afternoon_time_in,
                  entryValue.afternoon_time_out
                );
                const eveningHours = calculateEntryHours(
                  entryValue.evening_time_in,
                  entryValue.evening_time_out
                );
                const totalHours = morningHours + afternoonHours + eveningHours;

                return (
                  <EntriesCard
                    key={entryValue.id}
                    index={index}
                    entry={entryValue}
                    morningHours={morningHours}
                    afternoonHours={afternoonHours}
                    eveningHours={eveningHours}
                    totalHours={totalHours}
                  />
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
              className="underline hover:text-primary"
              href="https://aybangueco.vercel.app/"
            >
              aybangueco
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
}
