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
    it('should save transfer history successfully', async () => {
      const transferHistoryData = {
        senderUserId: '507f1f77bcf86cd799439011',
        receiverUserId: '507f1f77bcf86cd799439012',
        receiverCustomerRegisteredId: 'CUST123456',
        customerName: 'John Doe',
        commissionType: 'Referral Comm',
        amount: 1000.00,
        adminCharges: 50.00,
        netPayable: 950.00,
        fundsTransactionNo: 'TXN20241201001',
        status: 'Success' as const
      };
      
      const result = await fundsTransferHistoryService.saveTransferHistory(transferHistoryData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Transfer history saved successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('serialNo');
      expect(result.data).toHaveProperty('transferDate');
      expect(result.data).toHaveProperty('receiverCustomerRegisteredId', 'CUST123456');
      expect(result.data).toHaveProperty('customerName', 'John Doe');
      expect(result.data).toHaveProperty('fundsTransactionNo', 'TXN20241201001');
      expect(result.data).toHaveProperty('status', 'Success');
    });

    it('should save failed transfer history', async () => {
      const transferHistoryData = {
        senderUserId: '507f1f77bcf86cd799439011',
        receiverUserId: '507f1f77bcf86cd799439012',
        receiverCustomerRegisteredId: 'CUST123456',
        customerName: 'John Doe',
        commissionType: 'Referral Comm',
        amount: 1000.00,
        adminCharges: 0,
        netPayable: 0,
        fundsTransactionNo: 'TXN20241201002',
        status: 'Failed' as const,
        failureReason: 'Insufficient balance'
      };
      
      const result = await fundsTransferHistoryService.saveTransferHistory(transferHistoryData);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Transfer history saved successfully');
      expect(result.data).toHaveProperty('status', 'Failed');
    });

    it('should get transfer history with pagination', async () => {
      const result = await fundsTransferHistoryService.getTransferHistory(undefined, 1, 10);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Transfer history retrieved successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('history');
      expect(result.data).toHaveProperty('pagination');
      expect(Array.isArray(result.data.history)).toBe(true);
      expect(result.data.pagination).toHaveProperty('currentPage', 1);
      expect(result.data.pagination).toHaveProperty('totalPages');
      expect(result.data.pagination).toHaveProperty('totalRecords');
      expect(result.data.pagination).toHaveProperty('recordsPerPage', 10);
    });

    it('should get transfer history for specific user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const result = await fundsTransferHistoryService.getTransferHistory(userId, 1, 10);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Transfer history retrieved successfully');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('history');
      expect(result.data).toHaveProperty('pagination');
      expect(Array.isArray(result.data.history)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const result = await fundsTransferHistoryService.getTransferHistory(undefined, 2, 5);
      
      expect(result.success).toBe(true);
      expect(result.data.pagination.currentPage).toBe(2);
      expect(result.data.pagination.recordsPerPage).toBe(5);
      expect(result.data.pagination.totalRecords).toBeGreaterThanOrEqual(0);
    });

    it('should format history records correctly', async () => {
      const result = await fundsTransferHistoryService.getTransferHistory(undefined, 1, 1);
      
      expect(result.success).toBe(true);
      expect(result.data.history).toBeDefined();
      
      if (result.data.history.length > 0) {
        const record = result.data.history[0];
        expect(record).toHaveProperty('serialNo');
        expect(record).toHaveProperty('date');
        expect(record).toHaveProperty('receiverCustomerRegisteredId');
        expect(record).toHaveProperty('customerName');
        expect(record).toHaveProperty('fundsTransactionNo');
        expect(record).toHaveProperty('status');
        expect(['Success', 'Failed']).toContain(record.status);
      }
    });
  });

  describe('Funds Transfer History Controller Tests', () => {
    it('should save transfer history via HTTP endpoint', async () => {
      const transferHistoryData = {
        senderUserId: '507f1f77bcf86cd799439011',
        receiverUserId: '507f1f77bcf86cd799439012',
        receiverCustomerRegisteredId: 'CUST123456',
        customerName: 'John Doe',
        commissionType: 'Referral Comm',
        amount: 1000.00,
        adminCharges: 50.00,
        netPayable: 950.00,
        fundsTransactionNo: 'TXN20241201003',
        status: 'Success'
      };
      
      const response = await request(app.getHttpServer())
        .post('/funds-transfer-history/save-transfer')
        .send(transferHistoryData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transfer history saved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('serialNo');
      expect(response.body.data).toHaveProperty('transferDate');
      expect(response.body.data).toHaveProperty('receiverCustomerRegisteredId', 'CUST123456');
      expect(response.body.data).toHaveProperty('customerName', 'John Doe');
      expect(response.body.data).toHaveProperty('fundsTransactionNo', 'TXN20241201003');
      expect(response.body.data).toHaveProperty('status', 'Success');
    });

    it('should get transfer history via HTTP endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/funds-transfer-history/history')
        .query({ page: 1, limit: 10 })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transfer history retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('history');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.history)).toBe(true);
      expect(response.body.data.pagination).toHaveProperty('currentPage', 1);
      expect(response.body.data.pagination).toHaveProperty('totalPages');
      expect(response.body.data.pagination).toHaveProperty('totalRecords');
      expect(response.body.data.pagination).toHaveProperty('recordsPerPage', 10);
    });

    it('should get transfer history with user filter', async () => {
      const userId = '507f1f77bcf86cd799439011';
      
      const response = await request(app.getHttpServer())
        .get('/funds-transfer-history/history')
        .query({ userId, page: 1, limit: 10 })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Transfer history retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('history');
      expect(Array.isArray(response.body.data.history)).toBe(true);
    });

    it('should handle pagination via HTTP endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/funds-transfer-history/history')
        .query({ page: 2, limit: 5 })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.pagination.currentPage).toBe(2);
      expect(response.body.data.pagination.recordsPerPage).toBe(5);
      expect(response.body.data.pagination.totalRecords).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle service errors gracefully', async () => {
      try {
        const result = await fundsTransferHistoryService.getTransferHistory(undefined, 1, 10);
        expect(result.success).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle concurrent save requests', async () => {
      const transferHistoryData = {
        senderUserId: '507f1f77bcf86cd799439011',
        receiverUserId: '507f1f77bcf86cd799439012',
        receiverCustomerRegisteredId: 'CUST123456',
        customerName: 'John Doe',
        commissionType: 'Referral Comm',
        amount: 1000.00,
        adminCharges: 50.00,
        netPayable: 950.00,
        fundsTransactionNo: 'TXN20241201004',
        status: 'Success' as const
      };
      
      const promises = [
        fundsTransferHistoryService.saveTransferHistory(transferHistoryData),
        fundsTransferHistoryService.saveTransferHistory({ ...transferHistoryData, fundsTransactionNo: 'TXN20241201005' }),
        fundsTransferHistoryService.saveTransferHistory({ ...transferHistoryData, fundsTransactionNo: 'TXN20241201006' })
      ];
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple save requests efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, index) => 
        fundsTransferHistoryService.saveTransferHistory({
          senderUserId: '507f1f77bcf86cd799439011',
          receiverUserId: '507f1f77bcf86cd799439012',
          receiverCustomerRegisteredId: `CUST${index}`,
          customerName: `Customer ${index}`,
          commissionType: 'Referral Comm',
          amount: 100.00,
          adminCharges: 5.00,
          netPayable: 95.00,
          fundsTransactionNo: `TXN2024120100${index}`,
          status: 'Success' as const
        })
      );
      
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle large history retrieval efficiently', async () => {
      const startTime = Date.now();
      
      const result = await fundsTransferHistoryService.getTransferHistory(undefined, 1, 1000);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });
}); 