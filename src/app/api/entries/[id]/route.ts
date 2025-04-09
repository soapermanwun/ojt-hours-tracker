import { deleteEntry, getEntriesByID } from "@/app/modules/entries";
import { NextRequest } from "next/server";

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
