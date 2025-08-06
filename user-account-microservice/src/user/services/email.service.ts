import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(toEmail: string, subject: string, text: string, html: string) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'no-reply@salar.in',
        to: toEmail,
        subject: subject,
        text: text,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        status: 1,
        message: `Email sent successfully. Message ID: ${result.messageId}`,
      };
    } catch (error) {
      console.log(`mail error: ${error}`);
      return { 
        status: 0, 
        message: error.message || 'Failed to send email'
      };
    }
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const html = `
      <html>
        <body>
          <h2>HI! You have requested for a transaction password change otp</h2>
          <strong>OTP:</strong> ${otp}
          <h3></h3>
        </body>
      </html>
    `;

    await this.sendEmail(
      email,
      'Salar - Transaction Password OTP',
      '',
      html
    );
  }
} 