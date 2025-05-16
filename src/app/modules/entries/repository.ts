import { Entries } from "@/generated/client";
import { prisma } from "@/utils/prisma";

export async function getEntriesByUser(uuid: string): Promise<Entries[]> {
  return await prisma.entries.findMany({
    where: {
      created_by: uuid,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getEntriesByID(
  id: number,
  uuid: string
): Promise<Entries | null> {
  return await prisma.entries.findUnique({
    where: {
      id,
      created_by: uuid,
    },
  });
}

export async function createEntry(
  data: Omit<Entries, "id" | "created_at">
): Promise<Entries> {
  return await prisma.entries.create({ data });
}

export async function updateEntry(
  id: number,
  uuid: string,
  data: Omit<Entries, "id" | "created_at" | "created_by">
) {
  return await prisma.entries.update({
    data,
    where: {
      id,
      created_by: uuid,
    },
  });
}

export async function deleteEntry(id: number, uuid: string): Promise<Entries> {
  return await prisma.entries.delete({
    where: {
      id,
      created_by: uuid,
    },
  });
}
