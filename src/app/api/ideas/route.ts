import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { toContentIdea } from "@/lib/db/types";
import { isAuthenticated } from "@/lib/auth";

// GET all content ideas
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("content_ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Convert snake_case to camelCase for frontend
    const ideas = (data || []).map(toContentIdea);

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

    const { data: newIdea, error } = await supabase
      .from("content_ideas")
      .insert({
        title,
        description: description || null,
        type: type || "blog_post",
        status: "idea",
        linked_resource_ids: linkedResourceIds ? JSON.stringify(linkedResourceIds) : null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(toContentIdea(newIdea), { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
