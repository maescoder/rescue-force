import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { transporter } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, location, contact, rescuer_name, details, urgency } = data;

    // Insert into DB
    await pool.query(
      `INSERT INTO reports (type, location, contact, rescuer_name, details, urgency) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [type, location, contact, rescuer_name, details, urgency]
    );

    // Send Email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // send to admin
        subject: `URGENT: New Animal Report - ${urgency}`,
        text: `A new rescue report has been filed.\n\nType: ${type}\nLocation: ${location}\nContact: ${contact}\nRescuer: ${rescuer_name}\nUrgency: ${urgency}\nDetails: ${details}`
      });
    } catch(mailErr) {
      console.error("Mail error:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
