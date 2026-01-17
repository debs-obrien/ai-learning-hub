import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contentIdeas } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

// GET all content ideas
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ideas = await db
      .select()
      .from(contentIdeas)
      .orderBy(desc(contentIdeas.createdAt));

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

// POST new content idea
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, type, linkedResourceIds, notes } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newIdea = await db
      .insert(contentIdeas)
      .values({
        title,
        description: description || null,
        type: type || "blog_post",
        status: "idea",
        linkedResourceIds: linkedResourceIds ? JSON.stringify(linkedResourceIds) : null,
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newIdea[0], { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
