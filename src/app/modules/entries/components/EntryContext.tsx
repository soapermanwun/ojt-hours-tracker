"use client";

import { TimeEntry } from "@/utils/types";
import { createContext, ReactNode, useState } from "react";

type EntryContextType = {
  timeEntries: TimeEntry[];
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeEntry[]>>;
};

export const EntryContext = createContext<EntryContextType | undefined>(
  undefined
);

export default function EntryContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  return (
    <EntryContext.Provider value={{ timeEntries, setTimeEntries }}>
      {children}
    </EntryContext.Provider>
  );
}
