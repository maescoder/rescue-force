import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { transporter } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { applicant_name, email, phone, pet_type, experience, living_situation, additional_info } = data;

    // Insert into DB
    await pool.query(
      `INSERT INTO adoptions (applicant_name, email, phone, pet_type, experience, living_situation, additional_info) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [applicant_name, email, phone, pet_type, experience, living_situation, additional_info]
    );

    // Send Email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // send to admin
        subject: `New Adoption Application from ${applicant_name}`,
        text: `You have a new adoption application for a ${pet_type}!\n\nName: ${applicant_name}\nEmail: ${email}\nPhone: ${phone}\nExperience: ${experience}\nLiving Situation: ${living_situation}\nAdditional Info: ${additional_info}`
      });
    } catch(mailErr) {
      console.error("Mail error:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Adoption error:", error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
