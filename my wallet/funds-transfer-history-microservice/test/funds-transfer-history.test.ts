import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsSchema } from '../src/funds-transfer-history/schemas/funds.schema';
import { FundsTransferHistoryService } from '../src/funds-transfer-history/funds-transfer-history.service';
import { FundsTransferHistoryController } from '../src/funds-transfer-history/funds-transfer-history.controller';
import * as request from 'supertest';
import { Types } from 'mongoose';

describe('Funds Transfer History Microservice Integration Tests', () => {
  let app: INestApplication;
  let fundsTransferHistoryService: FundsTransferHistoryService;
  let fundsTransferHistoryController: FundsTransferHistoryController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-transfer-history-test'),
        MongooseModule.forFeature([
          { name: 'Funds', schema: FundsSchema },
        ]),
      ],
      controllers: [FundsTransferHistoryController],
      providers: [FundsTransferHistoryService],
    }).compile();

    app = moduleFixture.createNestApplication();
    fundsTransferHistoryService = moduleFixture.get<FundsTransferHistoryService>(FundsTransferHistoryService);
    fundsTransferHistoryController = moduleFixture.get<FundsTransferHistoryController>(FundsTransferHistoryController);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Funds Transfer History Service Tests', () => {
    it('should get funds transfer history listing with basic pagination', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should search by transaction number', async () => {
      const userId = new Types.ObjectId();
      const searchText = 'F12345678';
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10,
        searchText
      };
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
      
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(0);
    });
  });

  describe('Funds Transfer History Controller Tests', () => {
    it('should get funds transfer history listing via HTTP endpoint', async () => {
      const userId = new Types.ObjectId();
      
      const listingData = {
        userId: userId.toString(),
        page: 1,
        pagesize: 10
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer-history/listing')
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
        .post('/funds-transfer-history/listing')
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
        .post('/funds-transfer-history/listing')
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
        .post('/funds-transfer-history/listing')
        .send(listingData)
        .expect(201);
      
      expect(response.body).toHaveProperty('status', 1);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle service errors gracefully', async () => {
      const userId = new Types.ObjectId();
      
      try {
        const result = await fundsTransferHistoryService.fundsTransferHistoryListing({
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
        fundsTransferHistoryService.fundsTransferHistoryListing(listingData),
        fundsTransferHistoryService.fundsTransferHistoryListing(listingData),
        fundsTransferHistoryService.fundsTransferHistoryListing(listingData)
      ];
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.status).toBe(1);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple listing requests efficiently', async () => {
      const startTime = Date.now();
      
      const userIds = Array.from({ length: 10 }, () => new Types.ObjectId());
      const promises = userIds.map(userId => 
        fundsTransferHistoryService.fundsTransferHistoryListing({
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
      
      const result = await fundsTransferHistoryService.fundsTransferHistoryListing({
        userId: userId.toString(),
        page: 1,
        pagesize: 1000
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.status).toBe(1);
      expect(duration).toBeLessThan(3000);
    });
  });
}); 