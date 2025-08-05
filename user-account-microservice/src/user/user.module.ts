import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { User, UserSchema } from './schemas/user.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, SmsService],
  exports: [UserService],
})
export class UserModule {} 