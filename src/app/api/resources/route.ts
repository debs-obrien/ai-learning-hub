import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { toResource } from "@/lib/db/types";
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

    let query = supabase
      .from("resources")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Convert snake_case to camelCase for frontend
    const resources = (data || []).map(toResource);

    return NextResponse.json(resources);
  } catch (error: unknown) {
    console.error("Error fetching resources:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch resources", details: errorMessage },
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
    const { data: existingResources } = await supabase
      .from("resources")
      .select("priority")
      .order("priority", { ascending: false })
      .limit(1);

    const maxPriority = existingResources?.[0]?.priority ?? -1;

    const { data: newResource, error } = await supabase
      .from("resources")
      .insert({
        url,
        title,
        description: description || null,
        category: category || "other",
        favicon: favicon || null,
        priority: maxPriority + 1,
        status: "to_learn",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(toResource(newResource), { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating resource:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create resource", details: errorMessage },
      { status: 500 }
    );
  }
}
