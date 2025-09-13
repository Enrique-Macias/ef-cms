import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailViaResend = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.SMTP_FROM || 'noreply@resend.dev',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Email sent successfully via Resend API:', data);
    return true;
  } catch (error) {
    console.error('Failed to send email via Resend API:', error);
    return false;
  }
};
