import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(resources)
        .set({ priority: i, updatedAt: new Date() })
        .where(eq(resources.id, orderedIds[i]));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering resources:", error);
    return NextResponse.json(
      { error: "Failed to reorder resources" },
      { status: 500 }
    );
  }
}
