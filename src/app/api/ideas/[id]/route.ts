import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { toContentIdea } from "@/lib/db/types";
import { isAuthenticated } from "@/lib/auth";

// PATCH update idea
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, type, status, linkedResourceIds, notes } = body;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (linkedResourceIds !== undefined) {
      updateData.linked_resource_ids = JSON.stringify(linkedResourceIds);
    }
    if (notes !== undefined) updateData.notes = notes;

    const { data: updated, error } = await supabase
      .from("content_ideas")
      .update(updateData)
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(toContentIdea(updated));
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
}

// DELETE idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { error } = await supabase
      .from("content_ideas")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    );
  }
}
