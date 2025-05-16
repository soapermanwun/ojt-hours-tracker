"use server";

import {
  createEntry,
  deleteEntry,
  getEntriesByUser,
  updateEntry,
} from "./repository";
import { Entries } from "@/generated/client";

export async function actionGetEntries(userID: string): Promise<{
  ok: boolean;
  data: Entries[] | null;
}> {
  try {
    const entries = await getEntriesByUser(userID);

    return { ok: true, data: entries };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null };
  }
}

export async function actionCreateEntry(
  userID: string,
  data: Omit<Entries, "id" | "created_at" | "created_by">
): Promise<{ ok: boolean; data: Entries | null }> {
  try {
    const entry = await createEntry({
      ...data,
      created_by: userID,
    });

    return { ok: true, data: entry };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null };
  }
}

export async function actionUpdateEntry(
  entryID: number,
  userID: string,
  data: Omit<Entries, "id" | "created_at" | "created_by">
): Promise<{ ok: boolean; data: Entries | null }> {
  try {
    const entry = await updateEntry(entryID, userID, data);

    return { ok: true, data: entry };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null };
  }
}

export async function actionDeleteEntry(
  entryID: number,
  userID: string
): Promise<{ ok: boolean }> {
  try {
    await deleteEntry(entryID, userID);

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
}
