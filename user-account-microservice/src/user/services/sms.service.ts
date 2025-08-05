import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  async sendConfirmationMessages(mobile: string, message: string, templateId: string) {
    try {
      console.log('SMS_USER', process.env.SMS_USER);
      console.log('SMS_PASSWORD', process.env.SMS_PASSWORD);
      console.log('SMS_SENDER', process.env.SMS_SENDER);
      console.log('mobile', mobile);
      console.log('message', message);
      console.log('templateId', templateId);

      let sendMessage = await axios.post(
        `https://login.bulksmsgateway.in/sendmessage.php?user=${process.env.SMS_USER}&password=${process.env.SMS_PASSWORD}&mobile=${mobile}&sender=${process.env.SMS_SENDER}&message=${message}&type=3&template_id=${templateId}`,
        ''
      );
      console.log('sendMessage', sendMessage);
      return {
        status: 1,
        message: 'message send',
        result: sendMessage,
      };
    } catch (error) {
      console.error('error', error);
      return { status: 0, message: error.message };
    }
  }

  async sendOtp(mobileNo: string, otp: string): Promise<void> {
    const message = encodeURI(
      `Dear customer, Welcome to www.salar.in, Your OTP for User change transaction Password is ${otp}, Regards Sworld Solutions Private Limited.`
    );

    await this.sendConfirmationMessages(
      mobileNo, 
      message, 
      process.env.SMS_TRANS_PASSWORD_OTP_TEMPLATEID
    );
  }
} 