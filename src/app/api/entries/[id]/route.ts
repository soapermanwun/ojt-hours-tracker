import {
  deleteEntry,
  entriesSchema,
  getEntriesByID,
  updateEntry,
} from "@/app/modules/entries";
import { NextRequest } from "next/server";
import { Entries } from "../../../../../generated/prisma";
import { ZodError } from "zod";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const body = await request.json();

  const {
    date,
    morning_time_in,
    morning_time_out,
    afternoon_time_in,
    afternoon_time_out,
    evening_time_in,
    evening_time_out,
  } = body as Entries;

  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const created_by = searchParams.get("created_by");

  if (!created_by) {
    return new Response(
      JSON.stringify({ error: "The requested resource could not be found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!id) {
    return new Response(
      JSON.stringify({ error: "The requested resource could not be found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

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

    const existingEntry = await getEntriesByID(Number(id), created_by);

    if (!existingEntry) {
      return new Response(
        JSON.stringify({ error: "The requested resource could not be found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await updateEntry(Number(id), created_by, input);

    return new Response(null, {
      status: 204,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const created_by = searchParams.get("created_by");

  if (!created_by) {
    return new Response(
      JSON.stringify({ error: "The requested resource could not be found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!id) {
    return new Response(
      JSON.stringify({ error: "The requested resource could not be found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const existingEntry = await getEntriesByID(Number(id), created_by);

    if (!existingEntry) {
      return new Response(
        JSON.stringify({ error: "The requested resource could not be found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await deleteEntry(Number(id), created_by);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
