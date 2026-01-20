import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

export async function GET(request: NextRequest) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    return NextResponse.json({ 
      error: "DATABASE_URL not set",
      env_keys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('SUPA'))
    });
  }
  
  // Mask the password for display
  const maskedUrl = connectionString.replace(/:([^@]+)@/, ':****@');
  
  try {
    const sql = postgres(connectionString, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10,
    });
    
    // Try a simple query
    const result = await sql`SELECT 1 as test`;
    await sql.end();
    
    return NextResponse.json({ 
      success: true, 
      message: "Connection works!",
      maskedUrl,
      testResult: result
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: string; errno?: number; syscall?: string };
    return NextResponse.json({ 
      error: "Connection failed",
      maskedUrl,
      details: {
        message: err.message,
        name: err.name,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
      }
    }, { status: 500 });
  }
}
