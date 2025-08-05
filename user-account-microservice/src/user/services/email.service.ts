import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SEND_GRID_TOKEN);
  }

  async sendEmail(toEmail: string, subject: string, text: string, html: string) {
    try {
      const result = await sgMail.send({
        to: toEmail,
        from: 'no-reply@salar.in',
        subject: subject,
        text: text,
        html: html,
      });

      return {
        status: 1,
        message: result[0].statusCode,
      };
    } catch (error) {
      console.log(`mail error: ${error}`);
      return { 
        status: 0, 
        message: error.response?.body || error.message 
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