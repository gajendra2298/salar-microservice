import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/services/user.service';
import { EmailService } from '../src/user/services/email.service';
import { SmsService } from '../src/user/services/sms.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/user/schemas/user.schema';
import { Otp } from '../src/user/schemas/otp.schema';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  };

  const mockOtpModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockEmailService = {
    sendOtp: jest.fn(),
  };

  const mockSmsService = {
    sendOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Otp.name),
          useValue: mockOtpModel,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUser = {
        password: await bcrypt.hash('OldPass123!', 10),
        transactionPassword: await bcrypt.hash('TransPass123!', 10),
        save: jest.fn(),
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);
      
      const changePasswordDto = {
        oldPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        transactionPassword: 'TransPass123!',
      };

      const result = await service.changePassword('userId', changePasswordDto);
      
      expect(result.message).toBe('Password updated successfully');
      expect(result.status).toBe(1);
    });
  });

  describe('changeTransactionPasswordRequest', () => {
    it('should generate and send OTP successfully', async () => {
      const mockUser = {
        emailId: 'test@example.com',
        mobileNo: '+1234567890',
        _id: 'userId',
        role: 'regular',
        fullName: 'Test User',
        registerId: 'TEST123',
        countryId: { name: 'India' },
      };

      // Mock the findOne method to return a chainable object
      const mockFindOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      });

      mockUserModel.findOne = mockFindOne;
      mockUserModel.findOneAndUpdate.mockResolvedValue(mockUser);

      const getOtpDto = {
        emailId: 'test@example.com',
        mobileNo: '+1234567890',
      };

      const result = await service.changeTransactionPasswordRequest('userId', getOtpDto);
      
      expect(result.message).toBe('OTP sent successfully');
      expect(result.status).toBe(1);
    });
  });
}); 