import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const my_email = process.env.MY_EMAIL;

export async function POST(req) {
  try {
    const { email, phone, message } = await req.json();

    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [my_email],
      subject: "New Contact Form Submission",
      html: `<p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    return Response.json({ success: true, data: response });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
