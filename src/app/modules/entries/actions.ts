"use server";

import { Entries } from "@/generated/prisma";
import {
  createEntries,
  deleteEntry,
  getEntriesByID,
  getEntriesByUser,
  updateEntry,
} from ".";

export async function actionGetEntriesByUser(uuid: string): Promise<Entries[]> {
  return await getEntriesByUser(uuid);
}

export async function actionGetEntryByUser(
  id: number,
  uuid: string
): Promise<Entries | null> {
  return await getEntriesByID(id, uuid);
}

export async function actionCreateEntry(
  uuid: string,
  data: Omit<Entries, "id" | "created_at" | "created_by">
) {
  return await createEntries({ ...data, created_by: uuid });
}

export async function actionUpdateEntry(
  id: number,
  uuid: string,
  data: Omit<Entries, "id" | "created_at" | "created_by">
) {
  return await updateEntry(id, uuid, { ...data });
}

export async function actionDeleteEntry(id: number, uuid: string) {
  return await deleteEntry(id, uuid);
}
