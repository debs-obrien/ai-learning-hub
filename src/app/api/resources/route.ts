import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";
import { desc, asc } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

// GET all resources
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // We'll filter in memory for simplicity with drizzle
    const allResources = await db
      .select()
      .from(resources)
      .orderBy(asc(resources.priority), desc(resources.createdAt));

    let filtered = allResources;

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (category) {
      filtered = filtered.filter((r) => r.category === category);
    }

    return NextResponse.json(filtered);
  } catch (error: unknown) {
    console.error("Error fetching resources:", error);
    
    // Get detailed error info
    let errorDetails = "Unknown error";
    if (error instanceof Error) {
      errorDetails = JSON.stringify({
        message: error.message,
        name: error.name,
        stack: error.stack?.split("\n").slice(0, 3).join(" | "),
        // Include any additional properties
        ...(error as Record<string, unknown>)
      });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch resources", details: errorDetails },
      { status: 500 }
    );
  }
}

// POST new resource
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, title, description, category, favicon } = body;

    if (!url || !title) {
      return NextResponse.json(
        { error: "URL and title are required" },
        { status: 400 }
      );
    }

    // Get the max priority to add new item at the end
    const existingResources = await db.select().from(resources);
    const maxPriority = existingResources.reduce(
      (max, r) => Math.max(max, r.priority),
      -1
    );

    const newResource = await db
      .insert(resources)
      .values({
        url,
        title,
        description: description || null,
        category: category || "other",
        favicon: favicon || null,
        priority: maxPriority + 1,
        status: "to_learn",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newResource[0], { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating resource:", error);
    
    let errorDetails = "Unknown error";
    if (error instanceof Error) {
      errorDetails = JSON.stringify({
        message: error.message,
        name: error.name,
      });
    }
    
    return NextResponse.json(
      { error: "Failed to create resource", details: errorDetails },
      { status: 500 }
    );
  }
}
