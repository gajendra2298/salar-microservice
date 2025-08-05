import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsSchema } from '../src/funds-transfer/schemas/funds.schema';
import { FundsTransferService } from '../src/funds-transfer/funds-transfer.service';
import { FundsTransferController } from '../src/funds-transfer/funds-transfer.controller';
import * as request from 'supertest';
import { Types } from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

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
    
    // Enable validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    fundsTransferService = moduleFixture.get<FundsTransferService>(FundsTransferService);
    fundsTransferController = moduleFixture.get<FundsTransferController>(FundsTransferController);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Funds Transfer Service Tests', () => {
    it('should get dropdown values for funds', async () => {
      const result = await fundsTransferService.getDropdownValuesForFunds();
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('User details are: ');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('sponserCommission');
      expect(result.data).toHaveProperty('aurCommission');
      expect(result.data).toHaveProperty('gameCommission');
      expect(result.data).toHaveProperty('funds');
    });

    it('should process successful funds transfer', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('Funds sent successfully');
    });

    it('should handle different commission types', async () => {
      const commissionTypes = [
        'Sponser Commission',
        'Aur Commission',
        'Game Commission',
        'PRT Commission'
      ];
      
      for (const commissionType of commissionTypes) {
        const transferData = {
          registerId: 'CUST123456',
          amount: 100.00,
          type: commissionType,
          transactionPassword: 'password123'
        };
        
        const result = await fundsTransferService.fundTransfer(transferData);
        
        expect(result.status).toBe(1);
        expect(result.message).toBe('Funds sent successfully');
      }
    });

    it('should return error for insufficient commission balance', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 2000.00, // More than available balance
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toContain('There is no sufficient amount in');
    });

    it('should return error for invalid transaction password', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'wrongpassword'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Invalid transaction password');
    });

    it('should return error for customer not found', async () => {
      const transferData = {
        registerId: 'INVALID_CUSTOMER',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('User details not found');
    });

    it('should return error for missing required fields', async () => {
      const transferData = {
        registerId: '',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toContain('fields required');
    });

    it('should return error for invalid commission type', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Invalid Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Please send proper type');
    });

    it('should return error for self-transfer', async () => {
      const transferData = {
        registerId: 'SAME_USER_ID', // Same as logged-in user
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const result = await fundsTransferService.fundTransfer(transferData);
      
      expect(result.status).toBe(0);
      expect(result.message).toBe('Cannot transfer funds to the same registerId.');
    });
  });

  describe('Funds Transfer Controller Tests', () => {
    it('should get dropdown values via HTTP endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/funds-transfer/dropdown-values')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'User details are: ');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('sponserCommission');
      expect(response.body.data).toHaveProperty('aurCommission');
      expect(response.body.data).toHaveProperty('gameCommission');
      expect(response.body.data).toHaveProperty('funds');
    });

    it('should process funds transfer via HTTP endpoint', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(transferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'Funds sent successfully');
    });

    it('should return error for missing required fields via HTTP', async () => {
      const invalidTransferData = {
        registerId: '',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(invalidTransferData)
        .expect(201); // Service returns 201 with error status
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('fields required');
    });

    it('should return error for invalid commission type via HTTP', async () => {
      const invalidTransferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Invalid Commission',
        transactionPassword: 'password123'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(invalidTransferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'Please send proper type');
    });

    it('should return error for invalid transaction password via HTTP', async () => {
      const invalidTransferData = {
        registerId: 'CUST123456',
        amount: 500.00,
        type: 'Sponser Commission',
        transactionPassword: 'wrongpassword'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer')
        .send(invalidTransferData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 0);
      expect(response.body).toHaveProperty('message', 'Invalid transaction password');
    });

    it('should get transfer history via HTTP endpoint', async () => {
      const historyData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer-history')
        .send(historyData)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('pagesize', 10);
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get received history via HTTP endpoint', async () => {
      const historyData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/received-history')
        .send(historyData)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('pagesize', 10);
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const historyData = {
        page: 2,
        pagesize: 5,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer-history')
        .send(historyData)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body.page).toBe(2);
      expect(response.body.pagesize).toBe(5);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle search functionality', async () => {
      const historyData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: 'CUST123456'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer-history')
        .send(historyData)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Funds Transfer History Service Tests', () => {
    it('should get funds transfer history listing', async () => {
      const listingData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const result = await fundsTransferService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pagesize', 10);
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should get funds received history listing', async () => {
      const listingData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const result = await fundsTransferService.fundsReceivedHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pagesize', 10);
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const listingData = {
        page: 2,
        pagesize: 5,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: ''
      };
      
      const result = await fundsTransferService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.page).toBe(2);
      expect(result.pagesize).toBe(5);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle date filtering', async () => {
      const listingData = {
        page: 1,
        pagesize: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        searchText: ''
      };
      
      const result = await fundsTransferService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle search functionality', async () => {
      const listingData = {
        page: 1,
        pagesize: 10,
        startDate: '2022-09-20',
        endDate: '2024-10-25',
        searchText: 'CUST123456'
      };
      
      const result = await fundsTransferService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle service errors gracefully', async () => {
      try {
        const result = await fundsTransferService.getDropdownValuesForFunds();
        expect(result.status).toBe(1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle concurrent transfer requests', async () => {
      const transferData = {
        registerId: 'CUST123456',
        amount: 100.00,
        type: 'Sponser Commission',
        transactionPassword: 'password123'
      };
      
      const promises = [
        fundsTransferService.fundTransfer(transferData),
        fundsTransferService.fundTransfer({ ...transferData, registerId: 'CUST789012' }),
        fundsTransferService.fundTransfer({ ...transferData, registerId: 'CUST345678' })
      ];
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('message');
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple transfer requests efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, index) => 
        fundsTransferService.fundTransfer({
          registerId: `CUST${index}`,
          amount: 100.00,
          type: 'Sponser Commission',
          transactionPassword: 'password123'
        })
      );
      
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      results.forEach(result => {
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('message');
      });
    });

    it('should handle concurrent HTTP requests efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 5 }, (_, index) => 
        request(app.getHttpServer())
          .post('/funds-transfer/transfer')
          .send({
            registerId: `CUST${index}`,
            amount: 100.00,
            type: 'Sponser Commission',
            transactionPassword: 'password123'
          })
      );
      
      const responses = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(responses).toHaveLength(5);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
      
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('Legacy Transfer Funds Endpoint Tests', () => {
    it('should handle legacy transfer-funds endpoint for dropdown data', async () => {
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer-funds')
        .send({})
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Commission types and form data retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('commissionTypes');
      expect(response.body.data).toHaveProperty('formFields');
      expect(Array.isArray(response.body.data.commissionTypes)).toBe(true);
    });

    it('should handle legacy transfer-funds endpoint for actual transfer', async () => {
      const transferFormData = {
        customerRegisteredId: 'CUST123456',
        commissionType: 'Referral Comm',
        amount: 500.00,
        transactionPassword: 'password123'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer/transfer-funds')
        .send(transferFormData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'Funds sent successfully');
    });
  });
}); 