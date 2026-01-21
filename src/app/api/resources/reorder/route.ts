import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// POST reorder resources
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds must be an array" },
        { status: 400 }
      );
    }

    // Update priority for each resource based on its position in the array
    const updates = orderedIds.map((id: number, index: number) =>
      supabase
        .from("resources")
        .update({ priority: index, updated_at: new Date().toISOString() })
        .eq("id", id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering resources:", error);
    return NextResponse.json(
      { error: "Failed to reorder resources" },
      { status: 500 }
    );
  }
}
