import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FundsController } from '../src/funds/funds.controller';
import { FundsService } from '../src/funds/funds.service';
import { FundTransferDto } from '../src/funds/dto/fund-transfer.dto';
import { FundHistoryDto } from '../src/funds/dto/fund-history.dto';
import { UserDetailsDto } from '../src/funds/dto/user-details.dto';
import { FundType } from '../src/funds/schemas/funds.schema';

describe('FundsController', () => {
  let controller: FundsController;
  let service: FundsService;

  const mockFundsModel = {
    countDocuments: jest.fn(),
    new: jest.fn(),
    aggregate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundsController],
      providers: [
        FundsService,
        {
          provide: getModelToken('Funds'),
          useValue: mockFundsModel,
        },
      ],
    }).compile();

    controller = module.get<FundsController>(FundsController);
    service = module.get<FundsService>(FundsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDropdownValuesForFunds', () => {
    it('should return user details for valid user', async () => {
      const userDetailsDto: UserDetailsDto = {
        userId: '507f1f77bcf86cd799439011',
      };

      const result = await controller.getDropdownValuesForFunds(userDetailsDto);
      expect(result.status).toBe(1);
      expect(result.message).toBe('User details are: ');
      expect(result.data).toBeDefined();
      expect(result.data.sponserCommission).toBe(1000);
      expect(result.data.aurCommission).toBe(500);
      expect(result.data.gameCommission).toBe(750);
      expect(result.data.funds).toBe(2000);
      expect(result.data.prtCommission).toBe(300);
    });

    it('should throw error for invalid user', async () => {
      const userDetailsDto: UserDetailsDto = {
        userId: 'invalid-user-id',
      };

      await expect(controller.getDropdownValuesForFunds(userDetailsDto)).rejects.toThrow();
    });
  });

  describe('fundTransfer', () => {
    it('should transfer funds successfully', async () => {
      const fundTransferDto: FundTransferDto = {
        userId: '507f1f77bcf86cd799439011',
        registerId: 'USER002',
        amount: 100,
        type: FundType.SPONSOR_COMMISSION,
        transactionPassword: 'password123',
      };

      mockFundsModel.countDocuments.mockResolvedValue(0);
      mockFundsModel.new.mockReturnValue({
        save: jest.fn().mockResolvedValue({ 
          _id: 'test-id',
          transactionNo: 'FABCD123456789',
          amount: 100,
        }),
      });

      const result = await controller.fundTransfer(fundTransferDto);
      expect(result.status).toBe(1);
      expect(result.message).toBe('Funds sent successfully');
      expect(result.data.transactionNo).toBe('FABCD123456789');
      expect(result.data.amount).toBe(100);
      expect(result.data.receiverName).toBe('Jane Smith');
      expect(result.data.receiverRegisterId).toBe('USER002');
    });

    it('should throw error for invalid transaction password', async () => {
      const fundTransferDto: FundTransferDto = {
        userId: '507f1f77bcf86cd799439011',
        registerId: 'USER002',
        amount: 100,
        type: FundType.SPONSOR_COMMISSION,
        transactionPassword: 'invalidPassword',
      };

      await expect(controller.fundTransfer(fundTransferDto)).rejects.toThrow();
    });

    it('should throw error for insufficient balance', async () => {
      const fundTransferDto: FundTransferDto = {
        userId: '507f1f77bcf86cd799439011',
        registerId: 'USER002',
        amount: 2000, // More than available balance
        type: FundType.SPONSOR_COMMISSION,
        transactionPassword: 'password123',
      };

      await expect(controller.fundTransfer(fundTransferDto)).rejects.toThrow();
    });

    it('should throw error for same sender and receiver', async () => {
      const fundTransferDto: FundTransferDto = {
        userId: '507f1f77bcf86cd799439011',
        registerId: 'USER001', // Same as sender
        amount: 100,
        type: FundType.SPONSOR_COMMISSION,
        transactionPassword: 'password123',
      };

      await expect(controller.fundTransfer(fundTransferDto)).rejects.toThrow();
    });
  });

  describe('fundsTransferHistoryListing', () => {
    it('should return transfer history', async () => {
      const historyDto: FundHistoryDto = {
        userId: '507f1f77bcf86cd799439011',
        page: 1,
        pagesize: 10,
      };

      mockFundsModel.aggregate.mockResolvedValue([
        {
          createdAt: new Date(),
          transactionNo: 'FABCD123456789',
          commissionName: 'Sponser Commission',
          amount: 100,
          receiver: {
            _id: 'receiver-id',
            fullName: 'Jane Smith',
            registerId: 'USER002',
          },
          status: 'Success',
        },
      ]);

      const result = await controller.fundsTransferHistoryListing(historyDto);
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(result.page).toBe(1);
      expect(result.pagesize).toBe(10);
    });
  });

  describe('fundsReceivedHistoryListing', () => {
    it('should return received history', async () => {
      const historyDto: FundHistoryDto = {
        userId: '507f1f77bcf86cd799439011',
        page: 1,
        pagesize: 10,
      };

      mockFundsModel.aggregate.mockResolvedValue([
        {
          createdAt: new Date(),
          transactionNo: 'FABCD123456789',
          commissionName: 'Sponser Commission',
          amount: 100,
          sender: {
            _id: 'sender-id',
            fullName: 'John Doe',
            registerId: 'USER001',
            imageUrl: 'https://example.com/image.jpg',
          },
          status: 'Success',
        },
      ]);

      const result = await controller.fundsReceivedHistoryListing(historyDto);
      expect(result.status).toBe(1);
      expect(result.data).toBeDefined();
      expect(result.page).toBe(1);
      expect(result.pagesize).toBe(10);
    });
  });

  describe('getTransactionDetails', () => {
    it('should return transaction details', async () => {
      const transactionNo = 'FABCD123456789';
      
      mockFundsModel.findOne.mockResolvedValue({
        _id: 'test-id',
        transactionNo: 'FABCD123456789',
        amount: 100,
        type: 'Sponser Commission',
        status: 'Success',
        userId: '507f1f77bcf86cd799439011',
        receiverUserId: '507f1f77bcf86cd799439012',
        createdAt: new Date(),
      });

      const result = await controller.getTransactionDetails(transactionNo);
      expect(result.status).toBe(1);
      expect(result.message).toBe('Fund record retrieved successfully');
      expect(result.data.transactionNo).toBe(transactionNo);
    });

    it('should throw error for non-existent transaction', async () => {
      const transactionNo = 'INVALID123';
      
      mockFundsModel.findOne.mockResolvedValue(null);

      await expect(controller.getTransactionDetails(transactionNo)).rejects.toThrow();
    });
  });

  describe('getAllFundRecords', () => {
    it('should return all fund records for a user', async () => {
      const userDetailsDto: UserDetailsDto = {
        userId: '507f1f77bcf86cd799439011',
      };

      mockFundsModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            _id: 'record1',
            transactionNo: 'FABCD123456789',
            amount: 100,
            type: 'Sponser Commission',
            status: 'Success',
            userId: '507f1f77bcf86cd799439011',
            receiverUserId: '507f1f77bcf86cd799439012',
            createdAt: new Date(),
          },
          {
            _id: 'record2',
            transactionNo: 'FABCD123456790',
            amount: 200,
            type: 'Aur Commission',
            status: 'Success',
            userId: '507f1f77bcf86cd799439012',
            receiverUserId: '507f1f77bcf86cd799439011',
            createdAt: new Date(),
          },
        ]),
      });

      const result = await controller.getAllFundRecords(userDetailsDto);
      expect(result.status).toBe(1);
      expect(result.message).toBe('Fund records retrieved successfully');
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('getFundStatistics', () => {
    it('should return fund statistics for a user', async () => {
      const userDetailsDto: UserDetailsDto = {
        userId: '507f1f77bcf86cd799439011',
      };

      mockFundsModel.aggregate
        .mockResolvedValueOnce([
          {
            totalSent: 500,
            totalSentTransactions: 3,
            successSent: 2,
            failedSent: 1,
            pendingSent: 0,
          },
        ])
        .mockResolvedValueOnce([
          {
            totalReceived: 300,
            totalReceivedTransactions: 2,
            successReceived: 2,
            failedReceived: 0,
            pendingReceived: 0,
          },
        ]);

      const result = await controller.getFundStatistics(userDetailsDto);
      expect(result.status).toBe(1);
      expect(result.message).toBe('Fund statistics retrieved successfully');
      expect(result.data.sent.totalSent).toBe(500);
      expect(result.data.received.totalReceived).toBe(300);
      expect(result.data.netAmount).toBe(-200); // 300 - 500
    });
  });
}); 