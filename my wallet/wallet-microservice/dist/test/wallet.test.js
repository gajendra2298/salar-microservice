"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_schema_1 = require("../src/wallet/schemas/wallet.schema");
const wallet_service_1 = require("../src/wallet/wallet.service");
const wallet_controller_1 = require("../src/wallet/wallet.controller");
const request = require("supertest");
const mongoose_2 = require("mongoose");
describe('Wallet Microservice Integration Tests', () => {
    let app;
    let walletService;
    let walletController;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet-test'),
                mongoose_1.MongooseModule.forFeature([
                    { name: 'Wallet', schema: wallet_schema_1.WalletSchema },
                ]),
            ],
            controllers: [wallet_controller_1.WalletController],
            providers: [wallet_service_1.WalletService],
        }).compile();
        app = moduleFixture.createNestApplication();
        walletService = moduleFixture.get(wallet_service_1.WalletService);
        walletController = moduleFixture.get(wallet_controller_1.WalletController);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Wallet Service Tests', () => {
        it('should create a new wallet for user if it does not exist', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const result = await walletService.getWalletBalance(userId.toString());
            expect(result.status).toBe(1);
            expect(result.data).toBeDefined();
            expect(result.data.referralComm).toBe(0);
            expect(result.data.sponsorComm).toBe(0);
            expect(result.data.ausComm).toBe(0);
            expect(result.data.productTeamReferralCommission).toBe(0);
            expect(result.data.novaReferralCommission).toBe(0);
            expect(result.data.royaltyReferralTeamCommission).toBe(0);
            expect(result.data.shoppingAmount).toBe(0);
            expect(result.data.salarCoins).toBe(0);
            expect(result.data.royaltyCredits).toBe(0);
            expect(result.data.salarGiftCredits).toBe(0);
            expect(result.data.funds).toBe(0);
            expect(result.data.availableBalance).toBe(0);
        });
        it('should return existing wallet if it exists', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const firstResult = await walletService.getWalletBalance(userId.toString());
            const secondResult = await walletService.getWalletBalance(userId.toString());
            expect(firstResult.status).toBe(1);
            expect(secondResult.status).toBe(1);
            expect(firstResult.data).toBeDefined();
            expect(secondResult.data).toBeDefined();
        });
        it('should calculate available balance correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const updateData = {
                referralComm: 100,
                sponsorComm: 200,
                ausComm: 150,
                funds: 500,
                shoppingAmount: 75,
                salarCoins: 25,
                royaltyCredits: 50,
                salarGiftCredits: 30
            };
            const updatedResult = await walletService.updateWalletBalance(userId.toString(), updateData);
            const expectedBalance = 100 + 200 + 150 + 500 + 75 + 25 + 50 + 30;
            expect(updatedResult.status).toBe(1);
            expect(updatedResult.data.availableBalance).toBe(expectedBalance);
        });
        it('should update wallet balance correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const updateData = {
                referralComm: 1000,
                sponsorComm: 2000,
                ausComm: 1500,
                productTeamReferralCommission: 800,
                novaReferralCommission: 600,
                royaltyReferralTeamCommission: 400,
                shoppingAmount: 300,
                salarCoins: 200,
                royaltyCredits: 150,
                salarGiftCredits: 100,
                funds: 5000
            };
            const updatedResult = await walletService.updateWalletBalance(userId.toString(), updateData);
            expect(updatedResult.status).toBe(1);
            expect(updatedResult.data.referralComm).toBe(updateData.referralComm);
            expect(updatedResult.data.sponsorComm).toBe(updateData.sponsorComm);
            expect(updatedResult.data.ausComm).toBe(updateData.ausComm);
            expect(updatedResult.data.productTeamReferralCommission).toBe(updateData.productTeamReferralCommission);
            expect(updatedResult.data.novaReferralCommission).toBe(updateData.novaReferralCommission);
            expect(updatedResult.data.royaltyReferralTeamCommission).toBe(updateData.royaltyReferralTeamCommission);
            expect(updatedResult.data.shoppingAmount).toBe(updateData.shoppingAmount);
            expect(updatedResult.data.salarCoins).toBe(updateData.salarCoins);
            expect(updatedResult.data.royaltyCredits).toBe(updateData.royaltyCredits);
            expect(updatedResult.data.salarGiftCredits).toBe(updateData.salarGiftCredits);
            expect(updatedResult.data.funds).toBe(updateData.funds);
        });
        it('should handle partial updates correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            await walletService.getWalletBalance(userId.toString());
            const partialUpdate = {
                referralComm: 500,
                funds: 1000
            };
            const updatedResult = await walletService.updateWalletBalance(userId.toString(), partialUpdate);
            expect(updatedResult.status).toBe(1);
            expect(updatedResult.data.referralComm).toBe(500);
            expect(updatedResult.data.funds).toBe(1000);
            expect(updatedResult.data.sponsorComm).toBe(0);
            expect(updatedResult.data.ausComm).toBe(0);
        });
    });
    describe('Wallet Controller Tests', () => {
        it('should get wallet balance via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const response = await request(app.getHttpServer())
                .get(`/wallet/balance/${userId}`)
                .expect(200);
            expect(response.body).toHaveProperty('status', 1);
            expect(response.body).toHaveProperty('message', 'Wallet balance retrieved successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('availableBalance');
        });
        it('should update wallet balance via HTTP endpoint', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const updateData = {
                userId: userId.toString(),
                referralComm: 1000,
                sponsorComm: 2000,
                funds: 5000
            };
            const response = await request(app.getHttpServer())
                .post('/wallet/update-balance')
                .send(updateData)
                .expect(201);
            expect(response.body).toHaveProperty('status', 1);
            expect(response.body).toHaveProperty('message', 'Wallet balance updated successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('referralComm', 1000);
            expect(response.body.data).toHaveProperty('sponsorComm', 2000);
            expect(response.body.data).toHaveProperty('funds', 5000);
        });
        it('should return 400 for invalid user ID in GET request', async () => {
            const response = await request(app.getHttpServer())
                .get('/wallet/balance/invalid-id')
                .expect(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
            expect(response.body).toHaveProperty('message', 'Invalid user ID');
            expect(response.body).toHaveProperty('statusCode', 400);
        });
        it('should return 400 for missing userId in POST request', async () => {
            const updateData = {
                referralComm: 1000,
                sponsorComm: 2000
            };
            const response = await request(app.getHttpServer())
                .post('/wallet/update-balance')
                .send(updateData)
                .expect(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
            expect(response.body).toHaveProperty('message', 'userId is required');
            expect(response.body).toHaveProperty('statusCode', 400);
        });
        it('should return 400 for invalid user ID in POST request', async () => {
            const updateData = {
                userId: 'invalid-id',
                referralComm: 1000
            };
            const response = await request(app.getHttpServer())
                .post('/wallet/update-balance')
                .send(updateData)
                .expect(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
            expect(response.body).toHaveProperty('message', 'Invalid user ID');
            expect(response.body).toHaveProperty('statusCode', 400);
        });
    });
    describe('Wallet Schema Tests', () => {
        it('should create wallet with correct default values', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const result = await walletService.getWalletBalance(userId.toString());
            expect(result.data.referralComm).toBe(0);
            expect(result.data.sponsorComm).toBe(0);
            expect(result.data.ausComm).toBe(0);
            expect(result.data.productTeamReferralCommission).toBe(0);
            expect(result.data.novaReferralCommission).toBe(0);
            expect(result.data.royaltyReferralTeamCommission).toBe(0);
            expect(result.data.shoppingAmount).toBe(0);
            expect(result.data.salarCoins).toBe(0);
            expect(result.data.royaltyCredits).toBe(0);
            expect(result.data.salarGiftCredits).toBe(0);
            expect(result.data.funds).toBe(0);
            expect(result.data.availableBalance).toBe(0);
        });
        it('should handle large numbers correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const largeUpdateData = {
                referralComm: 999999999,
                sponsorComm: 888888888,
                funds: 777777777
            };
            const updatedResult = await walletService.updateWalletBalance(userId.toString(), largeUpdateData);
            expect(updatedResult.data.referralComm).toBe(999999999);
            expect(updatedResult.data.sponsorComm).toBe(888888888);
            expect(updatedResult.data.funds).toBe(777777777);
            expect(updatedResult.data.availableBalance).toBe(999999999 + 888888888 + 777777777);
        });
        it('should handle decimal numbers correctly', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const decimalUpdateData = {
                referralComm: 100.50,
                sponsorComm: 200.75,
                funds: 500.25
            };
            const updatedResult = await walletService.updateWalletBalance(userId.toString(), decimalUpdateData);
            expect(updatedResult.data.referralComm).toBe(100.50);
            expect(updatedResult.data.sponsorComm).toBe(200.75);
            expect(updatedResult.data.funds).toBe(500.25);
            expect(updatedResult.data.availableBalance).toBe(100.50 + 200.75 + 500.25);
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle database connection errors gracefully', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            try {
                const result = await walletService.getWalletBalance(userId.toString());
                expect(result.status).toBe(1);
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        });
        it('should handle concurrent wallet creation', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            const promises = [
                walletService.getWalletBalance(userId.toString()),
                walletService.getWalletBalance(userId.toString()),
                walletService.getWalletBalance(userId.toString())
            ];
            const results = await Promise.all(promises);
            results.forEach(result => {
                expect(result.status).toBe(1);
            });
        });
    });
    describe('Performance Tests', () => {
        it('should handle multiple wallet operations efficiently', async () => {
            const startTime = Date.now();
            const userIds = Array.from({ length: 10 }, () => new mongoose_2.Types.ObjectId());
            const promises = userIds.map(userId => walletService.getWalletBalance(userId.toString()));
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(results).toHaveLength(10);
            expect(duration).toBeLessThan(5000);
        });
        it('should handle large balance updates efficiently', async () => {
            const userId = new mongoose_2.Types.ObjectId();
            await walletService.getWalletBalance(userId.toString());
            const startTime = Date.now();
            for (let i = 0; i < 100; i++) {
                await walletService.updateWalletBalance(userId.toString(), {
                    referralComm: i * 10,
                    sponsorComm: i * 20,
                    funds: i * 100
                });
            }
            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10000);
        });
    });
});
//# sourceMappingURL=wallet.test.js.map