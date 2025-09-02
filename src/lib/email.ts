import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter connection
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email connection failed:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  passwordReset: (resetLink: string, userName: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>EF CMS Team</p>
      </div>
    `,
  }),
  
  welcome: (userName: string, loginLink: string) => ({
    subject: 'Welcome to EF CMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to EF CMS!</h2>
        <p>Hello ${userName},</p>
        <p>Your account has been successfully created. You can now log in to the system:</p>
        <p style="margin: 20px 0;">
          <a href="${loginLink}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Login to CMS
          </a>
        </p>
        <p>If you have any questions, please contact the administrator.</p>
        <p>Best regards,<br>EF CMS Team</p>
      </div>
    `,
  }),
  
  accountDeactivated: (userName: string) => ({
    subject: 'Account Deactivated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Account Deactivated</h2>
        <p>Hello ${userName},</p>
        <p>Your account has been deactivated by an administrator.</p>
        <p>If you believe this is an error, please contact the system administrator.</p>
        <p>Best regards,<br>EF CMS Team</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  ...args: any[]
): Promise<boolean> => {
  try {
    const emailContent = (emailTemplates[template] as any)(...args);
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Send custom email
export const sendCustomEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send custom email:', error);
    return false;
  }
};

export default transporter;
