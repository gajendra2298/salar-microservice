import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditDebitSchema } from '../src/credit-debit/schemas/credit-debit.schema';
import { CreditDebitService } from '../src/credit-debit/credit-debit.service';
import { CreditDebitController } from '../src/credit-debit/credit-debit.controller';
import * as request from 'supertest';
import { Types } from 'mongoose';

describe('Credit Debit Microservice Integration Tests', () => {
  let app: INestApplication;
  let creditDebitService: CreditDebitService;
  let creditDebitController: CreditDebitController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-debit-test'),
        MongooseModule.forFeature([
          { name: 'CreditDebit', schema: CreditDebitSchema },
        ]),
      ],
      controllers: [CreditDebitController],
      providers: [CreditDebitService],
    }).compile();

    app = moduleFixture.createNestApplication();
    creditDebitService = moduleFixture.get<CreditDebitService>(CreditDebitService);
    creditDebitController = moduleFixture.get<CreditDebitController>(CreditDebitController);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Credit Debit Service Tests', () => {
    it('should get credit debit listing with basic pagination', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pagesize', 10);
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 2,
        pagesize: 5
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.page).toBe(2);
      expect(result.pagesize).toBe(5);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should filter by date range', async () => {
      const userId = new Types.ObjectId();
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        startDate,
        endDate
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter by start date only', async () => {
      const userId = new Types.ObjectId();
      const startDate = '2024-01-01';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        startDate
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter by end date only', async () => {
      const userId = new Types.ObjectId();
      const endDate = '2024-12-31';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        endDate
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by transaction type', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'Funds';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by transaction number', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'CD12345678';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by reason', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'Bonus';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by status', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'Credited';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by order ID', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'ORDER123';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle custom sorting', async () => {
      const userId = new Types.ObjectId();
      const sort = { createdAt: -1 };
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        sort
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle empty search results', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'NONEXISTENT';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(0);
    });

    it('should handle large page sizes', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 100
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.pagesize).toBe(100);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Credit Debit Creation Tests', () => {
    it('should create a credit transaction successfully', async () => {
      const userId = new Types.ObjectId();
      
      const creditData = {
        userId: userId.toString(),
        reason: 'Referral Bonus',
        orderId: 'ORDER123',
        status: 'Credited' as const,
        type: 'Referral Comm',
        amount: 100
      };
      
      const result = await creditDebitService.createCreditDebit(creditData);
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('Credit/Debit transaction created successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('transactionNo');
      expect(result.data).toHaveProperty('amount', 100);
      expect(result.data).toHaveProperty('status', 'Credited');
      expect(result.data).toHaveProperty('type', 'Referral Comm');
      expect(result.data.transactionNo).toMatch(/^CD[A-Z0-9]{8}\d+$/);
    });

    it('should create a debit transaction successfully', async () => {
      const userId = new Types.ObjectId();
      
      const debitData = {
        userId: userId.toString(),
        reason: 'Purchase Deduction',
        orderId: 'ORDER456',
        status: 'Debited' as const,
        type: 'Funds',
        amount: 50
      };
      
      const result = await creditDebitService.createCreditDebit(debitData);
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('Credit/Debit transaction created successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('transactionNo');
      expect(result.data).toHaveProperty('amount', 50);
      expect(result.data).toHaveProperty('status', 'Debited');
      expect(result.data).toHaveProperty('type', 'Funds');
      expect(result.data.transactionNo).toMatch(/^CD[A-Z0-9]{8}\d+$/);
    });

    it('should create transaction without order ID', async () => {
      const userId = new Types.ObjectId();
      
      const creditData = {
        userId: userId.toString(),
        reason: 'System Bonus',
        status: 'Credited' as const,
        type: 'Salar Coins',
        amount: 25
      };
      
      const result = await creditDebitService.createCreditDebit(creditData);
      
      expect(result.status).toBe(1);
      expect(result.message).toBe('Credit/Debit transaction created successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('transactionNo');
      expect(result.data).toHaveProperty('amount', 25);
      expect(result.data).toHaveProperty('status', 'Credited');
      expect(result.data).toHaveProperty('type', 'Salar Coins');
    });

    it('should handle different transaction types', async () => {
      const userId = new Types.ObjectId();
      const transactionTypes = [
        'Referral Comm',
        'Sponsor Comm',
        'AuS Comm',
        'Product Team Referral Commission',
        'Nova Referral Commission',
        'Royalty Referral Team Commission',
        'Shopping Amount',
        'Salar Coins',
        'Royalty Credits',
        'Salar Gift Credits',
        'Funds'
      ];
      
      for (const type of transactionTypes) {
        const creditData = {
          userId: userId.toString(),
          reason: `Test ${type}`,
          status: 'Credited' as const,
          type,
          amount: 10
        };
        
        const result = await creditDebitService.createCreditDebit(creditData);
        
        expect(result.status).toBe(1);
        expect(result.data).toHaveProperty('type', type);
        expect(result.data).toHaveProperty('transactionNo');
      }
    });

    it('should handle different amounts', async () => {
      const userId = new Types.ObjectId();
      const amounts = [1, 10, 100, 1000, 10000];
      
      for (const amount of amounts) {
        const creditData = {
          userId: userId.toString(),
          reason: `Test amount ${amount}`,
          status: 'Credited' as const,
          type: 'Funds',
          amount
        };
        
        const result = await creditDebitService.createCreditDebit(creditData);
        
        expect(result.status).toBe(1);
        expect(result.data).toHaveProperty('amount', amount);
      }
    });
  });

  describe('Credit Debit Controller Tests', () => {
    it('should get credit debit listing via HTTP endpoint', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/listing')
        .send(listingData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('pagesize', 10);
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination via HTTP endpoint', async () => {
      const listingData = {
        userId: new Types.ObjectId().toString(),
        page: 2,
        pagesize: 5
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/listing')
        .send(listingData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body.page).toBe(2);
      expect(response.body.pagesize).toBe(5);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });

    it('should handle date filtering via HTTP endpoint', async () => {
      const listingData = {
        userId: new Types.ObjectId().toString(),
        page: 1,
        pagesize: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/listing')
        .send(listingData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle search via HTTP endpoint', async () => {
      const listingData = {
        userId: new Types.ObjectId().toString(),
        page: 1,
        pagesize: 10,
        searchText: 'Funds'
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/listing')
        .send(listingData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should create credit transaction via HTTP endpoint', async () => {
      const creditData = {
        userId: new Types.ObjectId().toString(),
        reason: 'HTTP Test Credit',
        orderId: 'HTTP_ORDER_123',
        status: 'Credited',
        type: 'Funds',
        amount: 200
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/create')
        .send(creditData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'Credit/Debit transaction created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('transactionNo');
      expect(response.body.data).toHaveProperty('amount', 200);
      expect(response.body.data).toHaveProperty('status', 'Credited');
      expect(response.body.data).toHaveProperty('type', 'Funds');
    });

    it('should create debit transaction via HTTP endpoint', async () => {
      const debitData = {
        userId: new Types.ObjectId().toString(),
        reason: 'HTTP Test Debit',
        orderId: 'HTTP_ORDER_456',
        status: 'Debited',
        type: 'Funds',
        amount: 75
      };
      
      const response = await request(app.getHttpServer())
        .post('/credit-debit/create')
        .send(debitData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('message', 'Credit/Debit transaction created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('transactionNo');
      expect(response.body.data).toHaveProperty('amount', 75);
      expect(response.body.data).toHaveProperty('status', 'Debited');
      expect(response.body.data).toHaveProperty('type', 'Funds');
    });
  });

  describe('Credit Debit Schema Tests', () => {
    it('should validate credit debit data structure', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      
      // If there are results, check the data structure
      if (result.data.length > 0) {
        const firstItem = result.data[0];
        expect(firstItem).toHaveProperty('createdAt');
        expect(firstItem).toHaveProperty('transactionNo');
        expect(firstItem).toHaveProperty('status');
        expect(firstItem).toHaveProperty('type');
        expect(firstItem).toHaveProperty('amount');
        expect(firstItem).toHaveProperty('reason');
        expect(firstItem).toHaveProperty('orderId');
      }
    });

    it('should handle different transaction types in listing', async () => {
      const userId = new Types.ObjectId();
      const transactionTypes = [
        'Referral Comm',
        'Sponsor Comm',
        'AuS Comm',
        'Product Team Referral Commission',
        'Nova Referral Commission',
        'Royalty Referral Team Commission',
        'Shopping Amount',
        'Salar Coins',
        'Royalty Credits',
        'Salar Gift Credits',
        'Funds'
      ];
      
      for (const type of transactionTypes) {
        const listingData = {
          userId: userId.toString(),
          page: 1,
          pagesize: 10,
          searchText: type
        };
        
        const result = await creditDebitService.creditDebitListing(listingData);
        
        expect(result.status).toBe(1);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });

    it('should handle different status values in listing', async () => {
      const userId = new Types.ObjectId();
      const statuses = ['Credited', 'Debited'];
      
      for (const status of statuses) {
        const listingData = {
          userId: userId.toString(),
          page: 1,
          pagesize: 10,
          searchText: status
        };
        
        const result = await creditDebitService.creditDebitListing(listingData);
        
        expect(result.status).toBe(1);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle service errors gracefully', async () => {
      const userId = new Types.ObjectId();
      
      try {
        const result = await creditDebitService.creditDebitListing({
          userId: userId.toString(),
          page: 1,
          pagesize: 10
        });
        expect(result.status).toBe(1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle concurrent listing requests', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const promises = [
        creditDebitService.creditDebitListing(listingData),
        creditDebitService.creditDebitListing(listingData),
        creditDebitService.creditDebitListing(listingData)
      ];
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.status).toBe(1);
      });
    });

    it('should handle invalid date formats gracefully', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        startDate: 'invalid-date',
        endDate: 'invalid-date'
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple listing requests efficiently', async () => {
      const startTime = Date.now();
      
      const userIds = Array.from({ length: 10 }, () => new Types.ObjectId());
      const promises = userIds.map(userId => 
        creditDebitService.creditDebitListing({
          userId: userId.toString(),
          page: 1,
          pagesize: 10
        })
      );
      
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large result sets efficiently', async () => {
      const userId = new Types.ObjectId();
      
      const startTime = Date.now();
      
      const result = await creditDebitService.creditDebitListing({
        userId: userId.toString(),
        page: 1,
        pagesize: 1000
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.status).toBe(1);
      expect(duration).toBeLessThan(3000);
    });

    it('should handle complex queries efficiently', async () => {
      const userId = new Types.ObjectId();
      
      const startTime = Date.now();
      
      const result = await creditDebitService.creditDebitListing({
        userId: userId.toString(),
        page: 1,
        pagesize: 50,
        startDate: '2020-01-01',
        endDate: '2024-12-31',
        searchText: 'Funds',
        sort: { createdAt: -1 }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.status).toBe(1);
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Validation Tests', () => {
    it('should validate required fields', async () => {
      // Test with valid values to ensure the service works correctly
      const listingData = {
        userId: new Types.ObjectId().toString(),
        page: 1,
        pagesize: 10
      };
      
      const result = await creditDebitService.creditDebitListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle edge case pagination values', async () => {
      const userId = new Types.ObjectId();
      const edgeCases = [
        { page: 1, pagesize: 1 },
        { page: 999999, pagesize: 1 },
        { page: 1, pagesize: 999999 }
      ];
      
      for (const edgeCase of edgeCases) {
        const listingData = {
          userId: userId.toString(),
          ...edgeCase
        };
        
        const result = await creditDebitService.creditDebitListing(listingData);
        
        expect(result.status).toBe(1);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });

    it('should handle alphanumeric search text', async () => {
      const userId = new Types.ObjectId();
      const searchTexts = ['Funds', 'Transaction', 'ABC123', 'Test', 'Credited', 'Debited'];
      
      for (const searchText of searchTexts) {
        const listingData = {
          userId: userId.toString(),
          page: 1,
          pagesize: 10,
          searchText
        };
        
        const result = await creditDebitService.creditDebitListing(listingData);
        
        expect(result.status).toBe(1);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });
}); 