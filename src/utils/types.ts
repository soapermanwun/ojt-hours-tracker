export interface TimeEntry {
  id: number;
  date: string;
  morning_time_in: string;
  morning_time_out: string;
  afternoon_time_in: string;
  afternoon_time_out: string;
  evening_time_in: string;
  evening_time_out: string;
}

export type NewTimeEntry = Omit<TimeEntry, "id">;
