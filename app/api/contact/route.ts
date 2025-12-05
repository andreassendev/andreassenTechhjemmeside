import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Environment variables (put these in .env.local):
// SMTP_HOST=smtp.myprovider.com
// SMTP_PORT=587
// SMTP_USER=martin@andreassenkapital.no
// SMTP_PASS=************
// CONTACT_TO_EMAIL=martin@andreassenkapital.no

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Validate form data
function validateFormData(data: unknown): data is ContactFormData {
  if (typeof data !== "object" || data === null) return false;
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.name === "string" &&
    obj.name.trim().length > 0 &&
    typeof obj.email === "string" &&
    obj.email.trim().length > 0 &&
    obj.email.includes("@") &&
    typeof obj.message === "string" &&
    obj.message.trim().length > 0
  );
}

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();
    
    // Validate input
    if (!validateFormData(body)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // Get environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;

    // Validate environment variables
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactToEmail) {
      console.error("Missing SMTP configuration in environment variables");
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email content
    const subject = `New contact form message from ${name}`;
    const textBody = `
Name: ${name}
Email: ${email}

Message:
${message}
    `.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
          New Contact Form Message
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message.replace(/\n/g, "<br>")}</p>
        </div>
      </div>
    `.trim();

    // Send email
    await transporter.sendMail({
      from: smtpUser,
      to: contactToEmail,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: email,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log error on server
    console.error("Error sending contact form email:", error);
    
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}