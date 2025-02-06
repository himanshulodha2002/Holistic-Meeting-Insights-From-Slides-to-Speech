import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, phone, message } = await req.json();

    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["adityarajmathur2005@gmail.com"],
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
