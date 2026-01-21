import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      error: "Missing environment variables",
      env_keys: Object.keys(process.env).filter(
        (k) => k.includes("SUPABASE") || k.includes("DATABASE")
      ),
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test SELECT on resources
    const { data: resources, error: selectError } = await supabase
      .from("resources")
      .select("*")
      .limit(5);

    // Test INSERT on resources
    const { data: insertedResource, error: insertError } = await supabase
      .from("resources")
      .insert({
        url: "https://test.com",
        title: "Test Resource - DELETE ME",
        description: "This is a test",
        category: "blog",
        status: "to_learn",
        priority: 999,
      })
      .select()
      .single();

    // Clean up - delete the test resource if it was created
    let deleteResult = null;
    if (insertedResource?.id) {
      const { error: deleteError } = await supabase
        .from("resources")
        .delete()
        .eq("id", insertedResource.id);
      deleteResult = { deleted: !deleteError, error: deleteError?.message };
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection test",
      supabaseUrl,
      tests: {
        select: {
          success: !selectError,
          count: resources?.length || 0,
          error: selectError ? {
            message: selectError.message,
            code: selectError.code,
            hint: selectError.hint,
          } : null,
        },
        insert: {
          success: !insertError,
          data: insertedResource,
          error: insertError ? {
            message: insertError.message,
            code: insertError.code,
            hint: insertError.hint,
          } : null,
        },
        cleanup: deleteResult,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: "Connection failed",
        details: {
          message: err.message,
          name: err.name,
        },
      },
      { status: 500 }
    );
  }
}
