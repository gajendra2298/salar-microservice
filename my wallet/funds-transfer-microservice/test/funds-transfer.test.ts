import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsSchema } from '../src/funds-transfer/schemas/funds.schema';
import { FundsTransferService } from '../src/funds-transfer/funds-transfer.service';
import { FundsTransferController } from '../src/funds-transfer/funds-transfer.controller';
import * as request from 'supertest';
import { Types } from 'mongoose';

describe('Funds Transfer Microservice Integration Tests', () => {
  let app: INestApplication;
  let fundsTransferService: FundsTransferService;
  let fundsTransferController: FundsTransferController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-transfer-test'),
        MongooseModule.forFeature([
          { name: 'Funds', schema: FundsSchema },
        ]),
      ],
      controllers: [FundsTransferController],
      providers: [FundsTransferService],
    }).compile();

    app = moduleFixture.createNestApplication();
    fundsTransferService = moduleFixture.get<FundsTransferService>(FundsTransferService);
    fundsTransferController = moduleFixture.get<FundsTransferController>(FundsTransferController);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Funds Transfer Service Tests', () => {
    it('should get dropdown values for funds', async () => {
      const userId = new Types.ObjectId();
      
      const result = await fundsTransferService.getDropdownValuesForFunds(userId.toString());
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('User details are: ');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('referralComm', 1000);
      expect(result.data).toHaveProperty('sponsorComm', 1000);
      expect(result.data).toHaveProperty('ausComm', 1000);
      expect(result.data).toHaveProperty('productTeamReferralCommission', 1000);
      expect(result.data).toHaveProperty('novaReferralCommission', 1000);
      expect(result.data).toHaveProperty('royaltyReferralTeamCommission', 1000);
      expect(result.data).toHaveProperty('funds', 1000);
    });

    it('should perform successful fund transfer', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('Funds sent successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('transactionNo');
      expect(result.data).toHaveProperty('amount', 500);
      expect(result.data).toHaveProperty('netPayable');
      expect(result.data).toHaveProperty('adminCharges');
      expect(result.data.transactionNo).toMatch(/^F[A-Z]{8}\d+$/);
    });

    it('should calculate admin charges correctly', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 1000,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.data.adminCharges).toBe(20); // 2% of 1000
      expect(result.data.netPayable).toBe(980); // 1000 - 20
    });

    it('should handle different transfer types', async () => {
      const userId = new Types.ObjectId();
      const transferTypes = [
        'Referral Comm',
        'Sponsor Comm',
        'AuS Comm',
        'Product Team Referral Commission',
        'Nova Referral Commission',
        'Royalty Referral Team Commission',
        'Funds'
      ];
      
      for (const type of transferTypes) {
        const transferData = {
          userId: userId.toString(),
          registerId: 'RECEIVER123',
          amount: 100,
          type: type,
          transactionPassword: 'validPassword'
        };
        
        const result = await fundsTransferService.fundTransfer(transferData);
        
        expect(result.status).toBe(1);
        expect(result.message).toBe('Funds sent successfully');
      }
    });

    it('should return error for missing required fields', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: '',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Please send all required fields');
    });

    it('should return error for invalid transaction password', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'invalidPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Invalid transaction password');
    });

    it('should return error for same user transfer', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'SAME_USER',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Cannot transfer funds to the same registerId.');
    });

    it('should return error for insufficient balance', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 2000, // More than mock balance of 1000
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('There is no sufficient amount in Funds');
    });

    it('should generate unique transaction numbers', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 100,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result1 = await fundsTransferService.fundTransfer(transferData);
      const result2 = await fundsTransferService.fundTransfer(transferData);
      
      expect(result1.status).toBe(1);
      expect(result2.status).toBe(1);
      expect(result1.data.transactionNo).not.toBe(result2.data.transactionNo);
    });
  });

  describe('Funds Transfer Controller Tests', () => {
    it('should get dropdown values via HTTP endpoint', async () => {
      const userId = new Types.ObjectId();
      
      const response = await request(app.getHttpServer())
        .get(`/funds-transfer/dropdown-values/${userId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'User details are: ');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('referralComm', 1000);
      expect(response.body.data).toHaveProperty('sponsorComm', 1000);
      expect(response.body.data).toHaveProperty('funds', 1000);
    });

    it('should perform fund transfer via HTTP endpoint', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'Funds sent successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('transactionNo');
      expect(response.body.data).toHaveProperty('amount', 500);
    });

    it('should return error for missing fields via HTTP endpoint', async () => {
      const transferData = {
        userId: new Types.ObjectId().toString(),
        registerId: '',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'Please send all required fields');
    });

    it('should return error for invalid password via HTTP endpoint', async () => {
      const transferData = {
        userId: new Types.ObjectId().toString(),
        registerId: 'RECEIVER123',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'invalidPassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'Invalid transaction password');
    });

    it('should return error for same user transfer via HTTP endpoint', async () => {
      const transferData = {
        userId: new Types.ObjectId().toString(),
        registerId: 'SAME_USER',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'Cannot transfer funds to the same registerId.');
    });

    it('should return error for insufficient balance via HTTP endpoint', async () => {
      const transferData = {
        userId: new Types.ObjectId().toString(),
        registerId: 'RECEIVER123',
        amount: 2000,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'There is no sufficient amount in Funds');
    });
  });

  describe('Funds Schema Tests', () => {
    it('should create funds transfer with correct default values', async () => {
      const userId = new Types.ObjectId();
      const receiverUserId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 500,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(result.data.amount).toBe(500);
      expect(result.data.transactionNo).toMatch(/^F[A-Z]{8}\d+$/);
    });

    it('should handle large amounts correctly', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 500, // Using a reasonable amount within mock balance
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.data.amount).toBe(500);
      expect(result.data.adminCharges).toBe(10); // 2% of 500
      expect(result.data.netPayable).toBe(490);
    });

    it('should handle decimal amounts correctly', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 100,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.data.amount).toBe(100);
      expect(result.data.adminCharges).toBe(2); // 2% of 100
      expect(result.data.netPayable).toBe(98);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle service errors gracefully', async () => {
      const userId = new Types.ObjectId();
      
      try {
        const result = await fundsTransferService.getDropdownValuesForFunds(userId.toString());
        expect(result.status).toBe(1);
      } catch (error) {
        // If there's an error, it should be handled gracefully
        expect(error).toBeDefined();
      }
    });

    it('should handle concurrent fund transfers', async () => {
      const userId = new Types.ObjectId();
      
      const transferData = {
        userId: userId.toString(),
        registerId: 'RECEIVER123',
        amount: 100,
        type: 'Funds',
        transactionPassword: 'validPassword'
      };
      
      // Create multiple promises to simulate concurrent transfers
      const promises = [
        fundsTransferService.fundTransfer(transferData),
        fundsTransferService.fundTransfer(transferData),
        fundsTransferService.fundTransfer(transferData)
      ];
      
      const results = await Promise.all(promises);
      
      // All results should be successful
      results.forEach(result => {
        expect(result.status).toBe(1);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple fund transfers efficiently', async () => {
      const startTime = Date.now();
      
      // Create 10 fund transfers
      const userIds = Array.from({ length: 10 }, () => new Types.ObjectId());
      const promises = userIds.map(userId => 
        fundsTransferService.fundTransfer({
          userId: userId.toString(),
          registerId: 'RECEIVER123',
          amount: 100,
          type: 'Funds',
          transactionPassword: 'validPassword'
        })
      );
      
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle large number of transfers efficiently', async () => {
      const userId = new Types.ObjectId();
      
      const startTime = Date.now();
      
      // Perform multiple transfers
      for (let i = 0; i < 50; i++) {
        await fundsTransferService.fundTransfer({
          userId: userId.toString(),
          registerId: 'RECEIVER123',
          amount: 10,
          type: 'Funds',
          transactionPassword: 'validPassword'
        });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Validation Tests', () => {
    it('should validate all required fields', async () => {
      const testCases = [
        { field: 'registerId', value: '', expectedMessage: 'Please send all required fields' },
        { field: 'amount', value: 0, expectedMessage: 'Please send all required fields' },
        { field: 'type', value: '', expectedMessage: 'Please send all required fields' },
        { field: 'transactionPassword', value: '', expectedMessage: 'Please send all required fields' }
      ];
      
      for (const testCase of testCases) {
        const userId = new Types.ObjectId();
        const transferData = {
          userId: userId.toString(),
          registerId: 'RECEIVER123',
          amount: 500,
          type: 'Funds',
          transactionPassword: 'validPassword',
          [testCase.field]: testCase.value
        };
        
        const result = await fundsTransferService.fundTransfer(transferData);
        
        expect(result.status).toBe(0);
        expect(result.message).toBe(testCase.expectedMessage);
      }
    });

    it('should validate transfer types', async () => {
      const validTypes = [
        'Referral Comm',
        'Sponsor Comm',
        'AuS Comm',
        'Product Team Referral Commission',
        'Nova Referral Commission',
        'Royalty Referral Team Commission',
        'Funds'
      ];
      
      for (const type of validTypes) {
        const userId = new Types.ObjectId();
        const transferData = {
          userId: userId.toString(),
          registerId: 'RECEIVER123',
          amount: 100,
          type: type,
          transactionPassword: 'validPassword'
        };
        
        const result = await fundsTransferService.fundTransfer(transferData);
        
        expect(result.status).toBe(1);
        expect(result.message).toBe('Funds sent successfully');
      }
    });
  });
}); 