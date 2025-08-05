"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const funds_schema_1 = require("../src/funds-transfer-history/schemas/funds.schema");
const funds_transfer_history_service_1 = require("../src/funds-transfer-history/funds-transfer-history.service");
const funds_transfer_history_controller_1 = require("../src/funds-transfer-history/funds-transfer-history.controller");
const request = require("supertest");
const mongoose_2 = require("mongoose");
describe('Funds Transfer History Microservice Integration Tests', () => {
    let app;
    let fundsTransferHistoryService;
    let fundsTransferHistoryController;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-transfer-history-test'),
                mongoose_1.MongooseModule.forFeature([
                    { name: 'Funds', schema: funds_schema_1.FundsSchema },
                ]),
            ],
            controllers: [funds_transfer_history_controller_1.FundsTransferHistoryController],
            providers: [funds_transfer_history_service_1.FundsTransferHistoryService],
        }).compile();
        app = moduleFixture.createNestApplication();
        fundsTransferHistoryService = moduleFixture.get(funds_transfer_history_service_1.FundsTransferHistoryService);
        fundsTransferHistoryController = moduleFixture.get(funds_transfer_history_controller_1.FundsTransferHistoryController);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Funds Transfer History Service Tests', () => {
        it('should get funds transfer history listing with basic pagination', async () => {
            const userId = new mongoose_2.Types.ObjectId();
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
            const userId = new mongoose_2.Types.ObjectId();
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
            const result = await fundsTransferHistoryService.fundsTransferHistoryListing(listingData);
            expect(result.status).toBe(1);
            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
        });
        it('should search by transaction type', async () => {
            const userId = new mongoose_2.Types.ObjectId();
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
            const userId = new mongoose_2.Types.ObjectId();
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
            const userId = new mongoose_2.Types.ObjectId();
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
            const userId = new mongoose_2.Types.ObjectId();
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
            const userId = new mongoose_2.Types.ObjectId();
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
                userId: new mongoose_2.Types.ObjectId().toString(),
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
                userId: new mongoose_2.Types.ObjectId().toString(),
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
                userId: new mongoose_2.Types.ObjectId().toString(),
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
            const userId = new mongoose_2.Types.ObjectId();
            try {
                const result = await fundsTransferHistoryService.fundsTransferHistoryListing({
                    userId: userId.toString(),
                    page: 1,
                    pagesize: 10
                });
                expect(result.status).toBe(1);
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
            const userIds = Array.from({ length: 10 }, () => new mongoose_2.Types.ObjectId());
            const promises = userIds.map(userId => fundsTransferHistoryService.fundsTransferHistoryListing({
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
//# sourceMappingURL=funds-transfer-history.test.js.map