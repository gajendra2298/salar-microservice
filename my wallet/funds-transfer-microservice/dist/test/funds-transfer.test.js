"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const funds_schema_1 = require("../src/funds-transfer/schemas/funds.schema");
const funds_transfer_service_1 = require("../src/funds-transfer/funds-transfer.service");
const funds_transfer_controller_1 = require("../src/funds-transfer/funds-transfer.controller");
const request = require("supertest");
const mongoose_2 = require("mongoose");
const axios_1 = require("axios");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('Funds Transfer Microservice Integration Tests', () => {
    let app;
    let fundsTransferService;
    let fundsTransferController;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-transfer-test'),
                mongoose_1.MongooseModule.forFeature([
                    { name: 'Funds', schema: funds_schema_1.FundsSchema },
                ]),
            ],
            controllers: [funds_transfer_controller_1.FundsTransferController],
            providers: [funds_transfer_service_1.FundsTransferService],
        }).compile();
        app = moduleFixture.createNestApplication();
        fundsTransferService = moduleFixture.get(funds_transfer_service_1.FundsTransferService);
        fundsTransferController = moduleFixture.get(funds_transfer_controller_1.FundsTransferController);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Funds Transfer Service Tests', () => {
        it('should get dropdown values for funds', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: {
                    referralComm: 1000,
                    sponsorComm: 1000,
                    ausComm: 1000,
                    productTeamReferralCommission: 1000,
                    novaReferralCommission: 1000,
                    royaltyReferralTeamCommission: 1000,
                    funds: 1000,
                }
            });
            const result = await fundsTransferService.getDropdownValuesForFunds(userId.toString());
            expect(result.status).toBe(1);
            expect(result.message).toBe('User details fetched successfully');
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
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 1000 }
            });
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { success: true }
            });
            const result = await fundsTransferService.fundTransfer(transferData);
            expect(result.status).toBe(1);
            expect(result.message).toBe('Funds transferred successfully');
            expect(result.data).toBeDefined();
            expect(result.data).toHaveProperty('transactionNo');
            expect(result.data).toHaveProperty('amount', 500);
            expect(result.data).toHaveProperty('netPayable');
            expect(result.data).toHaveProperty('adminCharges');
            expect(result.data.transactionNo).toMatch(/^F[A-Z0-9]{8}\d+$/);
        });
        it('should calculate admin charges correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 1000,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 2000 }
            });
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { success: true }
            });
            const result = await fundsTransferService.fundTransfer(transferData);
            expect(result.status).toBe(1);
            expect(result.data.adminCharges).toBe(20);
            expect(result.data.netPayable).toBe(980);
        });
        it('should handle different transfer types', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 300,
                type: 'Referral Comm',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 500 }
            });
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { success: true }
            });
            const result = await fundsTransferService.fundTransfer(transferData);
            expect(result.status).toBe(1);
            expect(result.data.type).toBe('Referral Comm');
            expect(result.data.amount).toBe(300);
        });
        it('should return error for missing required fields', async () => {
            const transferData = {
                userId: 'USER123',
                registerId: '',
                amount: 500,
                type: 'Funds',
                transactionPassword: ''
            };
            await expect(fundsTransferService.fundTransfer(transferData)).rejects.toThrow('Please send all required fields');
        });
        it('should return error for invalid transaction password', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'invalidPassword'
            };
            mockedAxios.post.mockRejectedValueOnce({
                code: 'ECONNREFUSED'
            });
            await expect(fundsTransferService.fundTransfer(transferData)).rejects.toThrow('Authentication service unavailable');
        });
        it('should return error for same user transfer', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: userId.toString(),
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: userId.toString() }
            });
            await expect(fundsTransferService.fundTransfer(transferData)).rejects.toThrow('Cannot transfer funds to the same user');
        });
        it('should return error for insufficient balance', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 1500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 1000 }
            });
            await expect(fundsTransferService.fundTransfer(transferData)).rejects.toThrow('Insufficient balance in Funds. Available: 1000, Required: 1500');
        });
        it('should generate unique transaction numbers', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post
                .mockResolvedValueOnce({ status: 200, data: { valid: true } })
                .mockResolvedValueOnce({ status: 200, data: { valid: true } });
            mockedAxios.get
                .mockResolvedValueOnce({ status: 200, data: { userId: 'DIFFERENT_USER' } })
                .mockResolvedValueOnce({ status: 200, data: { userId: 'DIFFERENT_USER' } });
            mockedAxios.get
                .mockResolvedValueOnce({ status: 200, data: { balance: 1000 } })
                .mockResolvedValueOnce({ status: 200, data: { balance: 1000 } });
            mockedAxios.post
                .mockResolvedValueOnce({ status: 200, data: { success: true } })
                .mockResolvedValueOnce({ status: 200, data: { success: true } });
            const result1 = await fundsTransferService.fundTransfer(transferData);
            const result2 = await fundsTransferService.fundTransfer(transferData);
            expect(result1.data.transactionNo).not.toBe(result2.data.transactionNo);
            expect(result1.data.transactionNo).toMatch(/^F[A-Z0-9]{8}\d+$/);
            expect(result2.data.transactionNo).toMatch(/^F[A-Z0-9]{8}\d+$/);
        });
    });
    describe('Funds Transfer Controller Tests', () => {
        it('should get dropdown values via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: {
                    referralComm: 1000,
                    sponsorComm: 1000,
                    ausComm: 1000,
                    productTeamReferralCommission: 1000,
                    novaReferralCommission: 1000,
                    royaltyReferralTeamCommission: 1000,
                    funds: 1000,
                }
            });
            const response = await request(app.getHttpServer())
                .get(`/funds-transfer/dropdown-values/${userId}`)
                .expect(200);
            expect(response.body).toHaveProperty('status', 1);
            expect(response.body).toHaveProperty('message', 'User details fetched successfully');
            expect(response.body.data).toBeDefined();
        });
        it('should perform fund transfer via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 1000 }
            });
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { success: true }
            });
            const response = await request(app.getHttpServer())
                .post('/funds-transfer/transfer')
                .send(transferData)
                .expect(201);
            expect(response.body).toHaveProperty('status', 1);
            expect(response.body).toHaveProperty('message', 'Funds transferred successfully');
            expect(response.body.data).toBeDefined();
        });
        it('should return error for missing fields via HTTP endpoint', async () => {
            const transferData = {
                userId: 'USER123',
                registerId: '',
                amount: 500,
                type: 'Funds',
                transactionPassword: ''
            };
            const response = await request(app.getHttpServer())
                .post('/funds-transfer/transfer')
                .send(transferData)
                .expect(400);
            expect(response.body).toHaveProperty('statusCode', 400);
            expect(response.body).toHaveProperty('message', 'Please send all required fields');
        });
        it('should return error for invalid password via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'invalidPassword'
            };
            mockedAxios.post.mockRejectedValueOnce({
                code: 'ECONNREFUSED'
            });
            const response = await request(app.getHttpServer())
                .post('/funds-transfer/transfer')
                .send(transferData)
                .expect(503);
            expect(response.body).toHaveProperty('statusCode', 503);
            expect(response.body).toHaveProperty('message', 'Authentication service unavailable');
        });
        it('should return error for same user transfer via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: userId.toString(),
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: userId.toString() }
            });
            const response = await request(app.getHttpServer())
                .post('/funds-transfer/transfer')
                .send(transferData)
                .expect(400);
            expect(response.body).toHaveProperty('statusCode', 400);
            expect(response.body).toHaveProperty('message', 'Cannot transfer funds to the same user');
        });
        it('should return error for insufficient balance via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 1500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 1000 }
            });
            const response = await request(app.getHttpServer())
                .post('/funds-transfer/transfer')
                .send(transferData)
                .expect(400);
            expect(response.body).toHaveProperty('statusCode', 400);
            expect(response.body).toHaveProperty('message', 'Insufficient balance in Funds. Available: 1000, Required: 1500');
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle service errors gracefully', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            mockedAxios.get.mockRejectedValueOnce({
                code: 'ECONNREFUSED'
            });
            await expect(fundsTransferService.getDropdownValuesForFunds(userId.toString())).rejects.toThrow('User service is unavailable');
        });
        it('should handle concurrent fund transfers', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 100,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValue({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValue({
                status: 200,
                data: { balance: 1000 }
            });
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { success: true }
            });
            const promises = Array(5).fill(null).map(() => fundsTransferService.fundTransfer(transferData));
            const results = await Promise.all(promises);
            expect(results).toHaveLength(5);
            results.forEach(result => {
                expect(result.status).toBe(1);
                expect(result.message).toBe('Funds transferred successfully');
            });
        });
    });
    describe('Validation Tests', () => {
        it('should validate all required fields', async () => {
            const transferData = {
                userId: 'USER123',
                registerId: '',
                amount: 0,
                type: '',
                transactionPassword: ''
            };
            await expect(fundsTransferService.fundTransfer(transferData)).rejects.toThrow('Please send all required fields');
        });
        it('should validate transfer types', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const transferData = {
                userId: userId.toString(),
                registerId: 'RECEIVER123',
                amount: 500,
                type: 'Funds',
                transactionPassword: 'validPassword'
            };
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { valid: true }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { userId: 'DIFFERENT_USER' }
            });
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { balance: 1000 }
            });
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { success: true }
            });
            const result = await fundsTransferService.fundTransfer(transferData);
            expect(result.status).toBe(1);
            expect(result.data.type).toBe('Funds');
        });
    });
});
//# sourceMappingURL=funds-transfer.test.js.map