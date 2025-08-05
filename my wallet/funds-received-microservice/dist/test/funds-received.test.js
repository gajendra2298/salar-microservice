"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const funds_schema_1 = require("../src/funds-received/schemas/funds.schema");
const funds_received_service_1 = require("../src/funds-received/funds-received.service");
const funds_received_controller_1 = require("../src/funds-received/funds-received.controller");
const request = require("supertest");
const mongoose_2 = require("mongoose");
describe('Funds Received Microservice Integration Tests', () => {
    let app;
    let fundsReceivedService;
    let fundsReceivedController;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-received-test'),
                mongoose_1.MongooseModule.forFeature([
                    { name: 'Funds', schema: funds_schema_1.FundsSchema },
                ]),
            ],
            controllers: [funds_received_controller_1.FundsReceivedController],
            providers: [funds_received_service_1.FundsReceivedService],
        }).compile();
        app = moduleFixture.createNestApplication();
        fundsReceivedService = moduleFixture.get(funds_received_service_1.FundsReceivedService);
        fundsReceivedController = moduleFixture.get(funds_received_controller_1.FundsReceivedController);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Funds Received Service Tests', () => {
        it('should get funds received history listing with basic pagination', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('page', 1);
            expect(result).toHaveProperty('pagesize', 10);
            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('totalPages');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should handle pagination correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 2,
                pagesize: 5
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(result.page).toBe(2);
            expect(result.pagesize).toBe(5);
            expect(result.total).toBeGreaterThanOrEqual(0);
            expect(result.totalPages).toBeGreaterThanOrEqual(0);
        });
        it('should filter by date range', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const startDate = '2024-01-01';
            const endDate = '2024-12-31';
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate,
                endDate
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should filter by start date only', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const startDate = '2024-01-01';
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should filter by end date only', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const endDate = '2024-12-31';
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                endDate
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should filter by search text', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const searchText = 'test';
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                searchText
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should handle custom sorting', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const sort = { createdAt: -1 };
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                sort
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should handle all filters together', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const startDate = '2024-01-01';
            const endDate = '2024-12-31';
            const searchText = 'test';
            const sort = { createdAt: -1 };
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate,
                endDate,
                searchText,
                sort
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should handle empty result set', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
            expect(result.totalPages).toBe(0);
        });
        it('should handle large page size', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 100
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(result.pagesize).toBe(100);
            expect(Array.isArray(result.data)).toBe(true);
        });
    });
    describe('Funds Received Controller Tests', () => {
        it('should handle POST /funds-received/listing with basic data', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('page', 1);
            expect(response.body).toHaveProperty('pagesize', 10);
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('totalPages');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with date filters', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with search text', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                searchText: 'test'
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with sorting', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                sort: { createdAt: -1 }
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with all filters', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                searchText: 'test',
                sort: { createdAt: -1 }
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with pagination', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 2,
                pagesize: 5
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.page).toBe(2);
            expect(response.body.pagesize).toBe(5);
            expect(response.body.total).toBeGreaterThanOrEqual(0);
            expect(response.body.totalPages).toBeGreaterThanOrEqual(0);
        });
        it('should handle POST /funds-received/listing with large page size', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 100
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.pagesize).toBe(100);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it('should handle POST /funds-received/listing with empty result', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const requestBody = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const response = await request(app.getHttpServer())
                .post('/funds-received/listing')
                .send(requestBody)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual([]);
            expect(response.body.total).toBe(0);
            expect(response.body.totalPages).toBe(0);
        });
    });
    describe('Funds Received Schema Tests', () => {
        it('should validate funds received history data structure', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(result.data).toBeDefined();
            if (result.data.length > 0) {
                const firstItem = result.data[0];
                expect(firstItem).toHaveProperty('createdAt');
                expect(firstItem).toHaveProperty('transactionNo');
                expect(firstItem).toHaveProperty('commissionName');
                expect(firstItem).toHaveProperty('amount');
                expect(firstItem).toHaveProperty('status');
                expect(firstItem).toHaveProperty('sender');
            }
        });
        it('should handle different transfer types in received history', async () => {
            const userId = new mongoose_2.Types.ObjectId();
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
                const listingData = {
                    userId: userId.toString(),
                    page: 1,
                    pagesize: 10,
                    searchText: type
                };
                const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
                expect(result).toHaveProperty('data');
                expect(Array.isArray(result.data)).toBe(true);
            }
        });
        it('should handle different status values in received history', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const statuses = ['Pending', 'Failed', 'Success'];
            for (const status of statuses) {
                const listingData = {
                    userId: userId.toString(),
                    page: 1,
                    pagesize: 10,
                    searchText: status
                };
                const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
                expect(result).toHaveProperty('data');
                expect(Array.isArray(result.data)).toBe(true);
            }
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle service errors gracefully', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            try {
                const result = await fundsReceivedService.fundsReceivedHistoryListing({
                    userId: userId.toString(),
                    page: 1,
                    pagesize: 10
                });
                expect(result).toHaveProperty('data');
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        });
        it('should handle concurrent listing requests', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            };
            const promises = [
                fundsReceivedService.fundsReceivedHistoryListing(listingData),
                fundsReceivedService.fundsReceivedHistoryListing(listingData),
                fundsReceivedService.fundsReceivedHistoryListing(listingData)
            ];
            const results = await Promise.all(promises);
            results.forEach(result => {
                expect(result).toHaveProperty('data');
            });
        });
        it('should handle invalid date formats gracefully', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const listingData = {
                userId: userId.toString(),
                page: 1,
                pagesize: 10,
                startDate: 'invalid-date',
                endDate: 'invalid-date'
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple listing requests efficiently', async () => {
            const startTime = Date.now();
            const userIds = Array.from({ length: 10 }, () => new mongoose_2.Types.ObjectId());
            const promises = userIds.map(userId => fundsReceivedService.fundsReceivedHistoryListing({
                userId: userId.toString(),
                page: 1,
                pagesize: 10
            }));
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(results).toHaveLength(10);
            expect(duration).toBeLessThan(5000);
        });
        it('should handle large result sets efficiently', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const startTime = Date.now();
            const result = await fundsReceivedService.fundsReceivedHistoryListing({
                userId: userId.toString(),
                page: 1,
                pagesize: 1000
            });
            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(result).toHaveProperty('data');
            expect(duration).toBeLessThan(3000);
        });
        it('should handle complex queries efficiently', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const startTime = Date.now();
            const result = await fundsReceivedService.fundsReceivedHistoryListing({
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
            expect(result).toHaveProperty('data');
            expect(duration).toBeLessThan(2000);
        });
    });
    describe('Validation Tests', () => {
        it('should validate required fields', async () => {
            const listingData = {
                userId: new mongoose_2.Types.ObjectId().toString(),
                page: 1,
                pagesize: 10
            };
            const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should handle edge case pagination values', async () => {
            const userId = new mongoose_2.Types.ObjectId();
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
                const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
                expect(result).toHaveProperty('data');
                expect(Array.isArray(result.data)).toBe(true);
            }
        });
        it('should handle alphanumeric search text', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const searchTexts = ['Funds', 'Transaction', 'ABC123', 'Test'];
            for (const searchText of searchTexts) {
                const listingData = {
                    userId: userId.toString(),
                    page: 1,
                    pagesize: 10,
                    searchText
                };
                const result = await fundsReceivedService.fundsReceivedHistoryListing(listingData);
                expect(result).toHaveProperty('data');
                expect(Array.isArray(result.data)).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=funds-received.test.js.map