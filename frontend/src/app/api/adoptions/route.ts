import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM adoptions ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch adoptions:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
