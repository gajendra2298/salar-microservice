import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { GetOtpDto, ChangeTransactionPasswordDto } from '../dto/change-transaction-password.dto';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  // Password verification function
  async verifyPassword(data: { password: string; savedPassword: string }): Promise<boolean> {
    try {
      let isVerified = false;
      if (data && data.password && data.savedPassword) {
        isVerified = await bcrypt.compare(data.password, data.savedPassword);
      }
      return isVerified;
    } catch (error) {
      throw error;
    }
  }

  // Password validation function
  async passwordValidation(password: string): Promise<boolean> {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password.match(passwordRegex)) {
      return true;
    }
    return false;
  }

  // Encrypt password function
  async ecryptPassword(data: { password: string }): Promise<string> {
    try {
      if (data && data.password) {
        let password = bcrypt.hashSync(data.password, 10);
        return password;
      }
      return '';
    } catch (error) {
      throw error;
    }
  }

  // Change password validation function
  async changePasswordValidation(data: { passwordObj: { oldPassword: string; newPassword: string; savedPassword: string } }) {
    try {
      const passwordObj = data.passwordObj ? data.passwordObj : { oldPassword: '', newPassword: '', savedPassword: '' };
      const samePassword = passwordObj.oldPassword === passwordObj.newPassword;
      if (samePassword) {
        return {
          status: 0,
          message: 'Current password and new password should be different',
        };
      }

      const status = await this.verifyPassword({
        password: passwordObj.oldPassword,
        savedPassword: passwordObj.savedPassword,
      });
      if (!status) {
        return {
          status: 0,
          message: 'Please enter correct current password',
        };
      }

      const isPasswordValid = await this.passwordValidation(passwordObj.newPassword);
      if (!isPasswordValid) {
        return {
          status: 0,
          message: 'Max word limit - 15 (with Mix of Capital,Small Letters , One Numerical and One Special Character',
        };
      }

      const password = await this.ecryptPassword({
        password: passwordObj.newPassword,
      });
      return password;
    } catch (error) {
      throw error;
    }
  }

  // Change password function
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      // Verify transaction password
      const transactionPasswordStatus = await this.verifyPassword({
        password: changePasswordDto.transactionPassword,
        savedPassword: user.transactionPassword,
      });

      if (!transactionPasswordStatus) {
        throw new BadRequestException('Invalid transaction password');
      }

      const passwordObj = {
        oldPassword: changePasswordDto.oldPassword,
        newPassword: changePasswordDto.newPassword,
        savedPassword: user.password,
      };

      const password = await this.changePasswordValidation({
        passwordObj,
      });

      if (typeof password === 'object' && password.status === 0) {
        throw new BadRequestException(password.message);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { password: password },
        { new: true }
      );

      if (!updatedUser) {
        throw new BadRequestException('Password not updated');
      }

      return {
        status: 1,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Change transaction password request
  async changeTransactionPasswordRequest(userId: string, getOtpDto: GetOtpDto) {
    try {
      const userDetails = await this.userModel.findOne(
        { _id: userId, emailId: getOtpDto.emailId, mobileNo: getOtpDto.mobileNo },
        {
          fullName: 1,
          organisationId: 1,
          countryId: 1,
          role: 1,
          mobileNo: 1,
          emailId: 1,
          registerId: 1,
        }
      ).populate('countryId', { name: 1 });

      if (!userDetails) {
        throw new NotFoundException('User not found');
      }

      // Generate OTP
      const otp = Math.random().toString().substring(2, 8);

      const updatedOtp = await this.userModel.findOneAndUpdate(
        { _id: userDetails._id },
        { otp: otp },
        { new: true, upsert: true }
      );

      if (!updatedOtp) {
        throw new BadRequestException('OTP details not updated');
      }

      const name = userDetails.role === 'regular' ? userDetails.fullName : 'Organization';

      // Send email
      await this.emailService.sendOtp(userDetails.emailId, otp);

      // Send SMS if user is from India
      const countryId = userDetails.countryId as any;
      if (countryId && 
          typeof countryId === 'object' && 
          countryId.name === 'India' && 
          userDetails.mobileNo) {
        await this.smsService.sendOtp(userDetails.mobileNo, otp);
      }

      return {
        status: 1,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Change transaction password
  async changeTransactionPassword(userId: string, changeTransactionPasswordDto: ChangeTransactionPasswordDto) {
    try {
      const userDetails = await this.userModel.findOne({ _id: userId });
      if (!userDetails) {
        throw new NotFoundException('User not found');
      }

      if (changeTransactionPasswordDto.otp !== userDetails.otp || changeTransactionPasswordDto.otp === '') {
        throw new BadRequestException('Please enter valid OTP');
      }

      const encryptedPassword = await this.ecryptPassword({ 
        password: changeTransactionPasswordDto.newTransactionPassword 
      });

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userDetails._id,
        { transactionPassword: encryptedPassword, otp: '' },
        { new: true }
      );

      if (!updatedUser) {
        throw new BadRequestException('Transaction password not updated');
      }

      return {
        status: 1,
        message: 'Transaction password updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -transactionPassword');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
} 