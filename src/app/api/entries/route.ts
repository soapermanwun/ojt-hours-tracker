import { NextRequest } from "next/server";
import {
  createEntries,
  getEntriesByUser,
} from "../../modules/entries/repository";
import { Entries } from "../../../../generated/prisma";
import { entriesSchema } from "@/app/modules/entries";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const created_by = searchParams.get("created_by");

  if (!created_by) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const entries = await getEntriesByUser(created_by);

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    date,
    morning_time_in,
    morning_time_out,
    afternoon_time_in,
    afternoon_time_out,
    evening_time_in,
    evening_time_out,
    created_by,
  } = body as Entries;

  try {
    const input = entriesSchema.parse({
      date,
      morning_time_in,
      morning_time_out,
      afternoon_time_in,
      afternoon_time_out,
      evening_time_in: evening_time_in ?? null,
      evening_time_out: evening_time_out ?? null,
      created_by,
    });

    const newEntry = await createEntries(input);

    return new Response(JSON.stringify(newEntry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ errors: error.flatten() }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
