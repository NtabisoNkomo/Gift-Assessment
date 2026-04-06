import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { topGifts, shareId, email, name } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is missing. Skipping email.');
      return NextResponse.json({ message: 'Email service not configured' }, { status: 200 });
    }

    const shareUrl = `${new URL(req.url).origin}/results/${shareId}`;

    const { data, error } = await resend.emails.send({
      from: 'Spiritual Gifts <onboarding@resend.dev>',
      to: email || 'delivered@resend.dev', // Fallback for testing
      subject: 'Your Spiritual Gifts Assessment Results',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #10b981;">Your Spiritual Gifts Profile</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for completing the spiritual gifts assessment. Here are your top strengths:</p>
          <ul style="font-size: 18px; font-weight: bold;">
            ${topGifts.map((g: string) => `<li style="margin-bottom: 8px;">${g}</li>`).join('')}
          </ul>
          <p>You can view your full profile and individual gift descriptions at the link below:</p>
          <a href="${shareUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Full Results</a>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            Spiritual Gifts Assessment Platform
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
