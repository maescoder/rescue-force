import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM animals ORDER BY rescued_on DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch animals:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
