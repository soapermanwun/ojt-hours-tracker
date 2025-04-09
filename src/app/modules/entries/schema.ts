import { z } from "zod";

export const entriesSchema = z.object({
  date: z.string().date(),
  morning_time_in: z.string(),
  morning_time_out: z.string(),
  afternoon_time_in: z.string(),
  afternoon_time_out: z.string(),
  evening_time_in: z.string().nullable().default(null),
  evening_time_out: z.string().nullable().default(null),
  created_by: z.string(),
});

export type EntriesSchema = z.infer<typeof entriesSchema>;
