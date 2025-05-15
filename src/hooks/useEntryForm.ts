import { NewTimeEntry } from "@/utils/types";
import { useState } from "react";

export default function useEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [entryValue, setEntryValue] = useState<NewTimeEntry>({
    date: "",
    morning_time_in: "",
    morning_time_out: "",
    afternoon_time_in: "",
    afternoon_time_out: "",
    evening_time_in: "",
    evening_time_out: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEntryValue((prev) => ({ ...prev, [name]: value }));
  };

  return {
    isSubmitting,
    setIsSubmitting,
    entryValue,
    setEntryValue,
    handleInputChange,
  };
}
