import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, subject, message } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // 1. Send personalized email
    const { data, error } = await resend.emails.send({
      from: 'Spiritual Gifts <onboarding@resend.dev>',
      to: email || 'delivered@resend.dev',
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #3b82f6;">Message from Spiritual Gifts Admin</h1>
          <p>Hello ${name || 'there'},</p>
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-top: 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 30px;">Best regards,<br/>Spiritual Gifts Assessment Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an administrative message related to your Spiritual Gifts Assessment profile.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // 2. Store message history in Firestore using Admin SDK
    await adminDb.collection('sent_messages').add({
      recipientEmail: email,
      recipientName: name,
      subject: subject,
      message: message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'admin_to_user'
    });

    return NextResponse.json({ message: 'Email sent and logged successfully', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
