import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Funds, FundsDocument, FundType, FundStatus } from './schemas/funds.schema';
import { FundTransferDto } from './dto/fund-transfer.dto';
import { FundHistoryDto } from './dto/fund-history.dto';
import * as mockUserData from './mock-data/user-details.mock.json';
import * as _ from 'lodash';

@Injectable()
export class FundsService {
  private mockUsers = mockUserData.users;

  constructor(
    @InjectModel('Funds') private fundsModel: Model<FundsDocument>,
  ) {}

  /**
   * Generate a unique transaction number
   */
  private async generateTransactionNo(): Promise<string> {
    const fundsCount = await this.fundsModel.countDocuments();
    const randomGenerator = this.generateRandomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return 'F' + randomGenerator + (fundsCount + 1);
  }

  /**
   * Generate random string
   */
  private generateRandomString(length: number, chars: string): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Mock user data for demonstration
   */
  private getMockUserData(userId: string) {
    const mockUsers = {
      '507f1f77bcf86cd799439011': {
        _id: '507f1f77bcf86cd799439011',
        registerId: 'USER001',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '+1234567890',
        sponserCommission: 1000,
        aurCommission: 500,
        gameCommission: 750,
        funds: 2000,
        prtCommission: 300,
        status: true,
        isDeleted: false,
        transactionPassword: 'password123',
      },
      '507f1f77bcf86cd799439012': {
        _id: '507f1f77bcf86cd799439012',
        registerId: 'USER002',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '+0987654321',
        sponserCommission: 800,
        aurCommission: 400,
        gameCommission: 600,
        funds: 1500,
        prtCommission: 200,
        status: true,
        isDeleted: false,
        transactionPassword: 'password456',
      },
    };
    return mockUsers[userId] || null;
  }

  /**
   * Mock user by register ID
   */
  private getMockUserByRegisterId(registerId: string) {
    const mockUsers = {
      'USER001': {
        _id: '507f1f77bcf86cd799439011',
        registerId: 'USER001',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '+1234567890',
        sponserCommission: 1000,
        aurCommission: 500,
        gameCommission: 750,
        funds: 2000,
        prtCommission: 300,
        status: true,
        isDeleted: false,
      },
      'USER002': {
        _id: '507f1f77bcf86cd799439012',
        registerId: 'USER002',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '+0987654321',
        sponserCommission: 800,
        aurCommission: 400,
        gameCommission: 600,
        funds: 1500,
        prtCommission: 200,
        status: true,
        isDeleted: false,
      },
    };
    return mockUsers[registerId] || null;
  }

  /**
   * Mock password verification
   */
  private verifyTransactionPassword(userId: string, transactionPassword: string): boolean {
    // Find user from mock data - try multiple ways to find the user
    let user = this.mockUsers.find(u => u.registerId === userId);
    
    if (_.isEmpty(user)) {
      // Try to find by _id if userId is a MongoDB ObjectId
      user = this.mockUsers.find(u => u._id === userId);
    }
    
    if (_.isEmpty(user)) {
      // Try to find by emailId
      user = this.mockUsers.find(u => u.emailId === userId);
    }
    
    return user && user.transactionPassword === transactionPassword;
  }

  /**
   * Mock balance check
   */
  private checkUserBalance(userId: string, balanceType: string, amount: number): boolean {
    // Find user from mock data - try multiple ways to find the user
    let user = this.mockUsers.find(u => u.registerId === userId);
    
    if (_.isEmpty(user)) {
      // Try to find by _id if userId is a MongoDB ObjectId
      user = this.mockUsers.find(u => u._id === userId);
    }
    
    if (_.isEmpty(user)) {
      // Try to find by emailId
      user = this.mockUsers.find(u => u.emailId === userId);
    }
    
    if (!user) return false;
    const balance = user[balanceType] || 0;
    return balance >= amount;
  }

  /**
   * Get dropdown values for funds (user details)
   */
  async getDropdownValuesForFunds(userId: string) {
    try {
      // Find user from mock data - try multiple ways to find the user
      let user = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(user)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        user = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(user)) {
        // Try to find by emailId
        user = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(user)) {
        throw new BadRequestException('User details not found');
      }

      const userDetails = {
        sponserCommission: user.sponserCommission || 0,
        aurCommission: user.aurCommission || 0,
        gameCommission: user.gameCommission || 0,
        funds: user.funds || 0,
        prtCommission: user.prtCommission || 0,
      };
      
      return {
        status: 1,
        message: 'User details are: ',
        data: userDetails,
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw new BadRequestException('Failed to get user details');
    }
  }

  /**
   * Transfer funds between users
   */
  async fundTransfer(userId: string, fundTransferDto: FundTransferDto) {
    try {
      const { registerId, amount, type, transactionPassword } = fundTransferDto;

      // Verify transaction password
      const isPasswordValid = this.verifyTransactionPassword(userId, transactionPassword);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid transaction password');
      }

      // Get sender user details from mock data
      let senderUser = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(senderUser)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        senderUser = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(senderUser)) {
        // Try to find by emailId
        senderUser = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (!senderUser || senderUser.isDeleted || !senderUser.status) {
        throw new BadRequestException('User not found or inactive');
      }

      // Get receiver user details from mock data
      const receiverUser = this.mockUsers.find(u => u.registerId === registerId);
      if (!receiverUser || receiverUser.isDeleted || !receiverUser.status) {
        throw new BadRequestException('Receiver user not found or inactive');
      }

      // Check if sender and receiver are the same
      if (senderUser.registerId === registerId) {
        throw new BadRequestException('Cannot transfer funds to the same registerId.');
      }

      // Get balance key for the fund type
      const balanceKey = this.getBalanceKey(type);
      if (!balanceKey) {
        throw new BadRequestException('Invalid fund type');
      }

      // Check if user has sufficient balance
      const hasSufficientBalance = this.checkUserBalance(userId, balanceKey, amount);
      if (!hasSufficientBalance) {
        throw new BadRequestException(`There is no sufficient amount in ${type}`);
      }

      // Generate transaction number
      const transactionNo = await this.generateTransactionNo();

      // Create fund transfer record
      const newFund = new this.fundsModel({
        userId: new Types.ObjectId(senderUser._id),
        receiverUserId: new Types.ObjectId(receiverUser._id),
        type,
        amount,
        transactionNo,
        status: FundStatus.SUCCESS, // Mark as success since we're using mock data
      });

      const savedFund = await newFund.save();
      if (!savedFund) {
        throw new BadRequestException('Failed to create fund transfer record');
      }

      return {
        status: 1,
        message: 'Funds sent successfully',
        data: {
          transactionNo: savedFund.transactionNo,
          amount: savedFund.amount,
          receiverName: receiverUser.fullName,
          receiverRegisterId: receiverUser.registerId,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Fund transfer error:', error);
      throw new BadRequestException('Internal server error');
    }
  }

  /**
   * Get balance key for fund type
   */
  private getBalanceKey(type: FundType): string | null {
    const balanceKeys = {
      [FundType.SPONSOR_COMMISSION]: 'sponserCommission',
      [FundType.AUR_COMMISSION]: 'aurCommission',
      [FundType.GAME_COMMISSION]: 'gameCommission',
      [FundType.PRT_COMMISSION]: 'prtCommission',
    };
    return balanceKeys[type] || null;
  }

  /**
   * Get all fund records for a user (both sent and received)
   */
  async getAllFundRecordsByUserId(userId: string) {
    try {
      // Find user from mock data - try multiple ways to find the user
      let user = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(user)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        user = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(user)) {
        // Try to find by emailId
        user = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(user)) {
        throw new BadRequestException('User not found');
      }

      const userObjectId = new Types.ObjectId(user._id);
      
      const records = await this.fundsModel.find({
        $or: [
          { userId: userObjectId },
          { receiverUserId: userObjectId }
        ]
      }).sort({ createdAt: -1 });

      return {
        status: 1,
        message: 'Fund records retrieved successfully',
        data: records,
        total: records.length
      };
    } catch (error) {
      console.error('Error fetching fund records:', error);
      throw new BadRequestException('Failed to fetch fund records');
    }
  }

  /**
   * Get fund record by transaction number
   */
  async getFundRecordByTransactionNo(transactionNo: string) {
    try {
      const record = await this.fundsModel.findOne({ transactionNo });
      
      if (!record) {
        throw new NotFoundException('Transaction not found');
      }

      return {
        status: 1,
        message: 'Fund record retrieved successfully',
        data: record
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching fund record:', error);
      throw new BadRequestException('Failed to fetch fund record');
    }
  }

  /**
   * Get fund statistics for a user
   */
  async getFundStatisticsByUserId(userId: string) {
    try {
      // Find user from mock data - try multiple ways to find the user
      let user = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(user)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        user = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(user)) {
        // Try to find by emailId
        user = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(user)) {
        throw new BadRequestException('User not found');
      }

      const userObjectId = new Types.ObjectId(user._id);
      
      // Get sent funds statistics
      const sentStats = await this.fundsModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalSent: { $sum: '$amount' },
            totalSentTransactions: { $sum: 1 },
            successSent: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Success'] }, 1, 0]
              }
            },
            failedSent: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0]
              }
            },
            pendingSent: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
              }
            }
          }
        }
      ]);

      // Get received funds statistics
      const receivedStats = await this.fundsModel.aggregate([
        { $match: { receiverUserId: userObjectId } },
        {
          $group: {
            _id: null,
            totalReceived: { $sum: '$amount' },
            totalReceivedTransactions: { $sum: 1 },
            successReceived: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Success'] }, 1, 0]
              }
            },
            failedReceived: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0]
              }
            },
            pendingReceived: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
              }
            }
          }
        }
      ]);

      const sentData = sentStats[0] || {
        totalSent: 0,
        totalSentTransactions: 0,
        successSent: 0,
        failedSent: 0,
        pendingSent: 0
      };

      const receivedData = receivedStats[0] || {
        totalReceived: 0,
        totalReceivedTransactions: 0,
        successReceived: 0,
        failedReceived: 0,
        pendingReceived: 0
      };

      return {
        status: 1,
        message: 'Fund statistics retrieved successfully',
        data: {
          sent: sentData,
          received: receivedData,
          netAmount: receivedData.totalReceived - sentData.totalSent
        }
      };
    } catch (error) {
      console.error('Error fetching fund statistics:', error);
      throw new BadRequestException('Failed to fetch fund statistics');
    }
  }

  /**
   * Get funds transfer history
   */
  async fundsTransferHistoryListing(userId: string, historyDto: FundHistoryDto) {
    try {
      const { page = 1, pagesize = 10, startDate, endDate, searchText, sort = { _id: -1 } } = historyDto;
      const skip = (page - 1) * pagesize;

      // Find user from mock data - try multiple ways to find the user
      let user = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(user)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        user = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(user)) {
        // Try to find by emailId
        user = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(user)) {
        throw new BadRequestException('User not found');
      }

      // Build query
      const query: any = { userId: new Types.ObjectId(user._id) };

      // Date filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
        }
      }

      // Search filter
      if (searchText) {
        const regex = new RegExp(searchText, 'i');
        query.$or = [
          { type: regex },
          { transactionNo: regex },
        ];
      }

      // Execute aggregation
      const result = await this.fundsModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'receiverUserId',
            foreignField: '_id',
            as: 'receiver',
          },
        },
        { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            createdAt: 1,
            transactionNo: 1,
            commissionName: '$type',
            amount: 1,
            'receiver._id': 1,
            'receiver.fullName': 1,
            'receiver.registerId': 1,
            status: 1,
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: pagesize },
      ]);

      // Get total count
      const total = await this.fundsModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'receiverUserId',
            foreignField: '_id',
            as: 'receiver',
          },
        },
        { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1 } },
      ]);

      return {
        status: 1,
        data: result,
        page,
        pagesize,
        total: total.length,
      };
    } catch (error) {
      throw new BadRequestException('Internal server error');
    }
  }

  /**
   * Get funds received history
   */
  async fundsReceivedHistoryListing(userId: string, historyDto: FundHistoryDto) {
    try {
      const { page = 1, pagesize = 10, startDate, endDate, searchText, sort = { _id: -1 } } = historyDto;
      const skip = (page - 1) * pagesize;

      // Find user from mock data - try multiple ways to find the user
      let user = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(user)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        user = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(user)) {
        // Try to find by emailId
        user = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(user)) {
        throw new BadRequestException('User not found');
      }

      // Build query
      const query: any = { receiverUserId: new Types.ObjectId(user._id) };

      // Date filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
        }
      }

      // Search filter
      if (searchText) {
        const regex = new RegExp(searchText, 'i');
        query.$or = [
          { type: regex },
          { transactionNo: regex },
        ];
      }

      // Execute aggregation
      const result = await this.fundsModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'sender',
          },
        },
        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            createdAt: 1,
            transactionNo: 1,
            commissionName: '$type',
            amount: 1,
            'sender._id': 1,
            'sender.fullName': 1,
            'sender.registerId': 1,
            'sender.imageUrl': 1,
            status: 1,
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: pagesize },
      ]);

      // Get total count
      const total = await this.fundsModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'sender',
          },
        },
        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1 } },
      ]);

      return {
        status: 1,
        data: result,
        page,
        pagesize,
        total: total.length,
      };
    } catch (error) {
      throw new BadRequestException('Internal server error');
    }
  }
} 