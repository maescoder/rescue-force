import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT stat_key, stat_value FROM stats");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { stat_key } = await request.json();
    if (!stat_key) {
      return NextResponse.json({ error: 'Missing stat_key' }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO stats (stat_key, stat_value) VALUES (?, 1) ON DUPLICATE KEY UPDATE stat_value = stat_value + 1",
      [stat_key]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment stat:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
