import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Funds, FundsDocument } from './schemas/funds.schema';
import { appConfig } from '../config/app.config';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class FundsTransferService {
  constructor(
    @InjectModel(Funds.name) private fundsModel: Model<FundsDocument>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  /********************************************************
   Purpose: Get dropdown values for funds
   Method: Get
   Return: JSON String
   ********************************************************/
  async getDropdownValuesForFunds() {
    try {
      const userId = this.extractUserIdFromRequest();
      if (!userId) {
        return { status: 0, message: 'User ID not found in request' };
      }

      // Get user details from user-account microservice via TCP call
      const userDetails = await this.getUserDetails(userId);
      if (!userDetails) {
        return { status: 0, message: 'User details not found' };
      }

      return {
        status: 1,
        message: 'User details are: ',
        data: {
          sponserCommission: userDetails.sponserCommission || 0,
          aurCommission: userDetails.aurCommission || 0,
          gameCommission: userDetails.gameCommission || 0,
          funds: userDetails.funds || 0
        }
      };
    } catch (error) {
      console.log(`error: ${error}`);
      return { status: 0, message: 'Internal server error' };
    }
  }

  /********************************************************
   Purpose: Fund transfer
   Method: Post
   Authorisation: true
   Parameter:
   {
       "registerId":"",
       "amount": 100,
       "type": "Sponser Commission" (or) "Aur Commission" (or) "Game Commission" (or) "Funds",
       "transactionPassword": ""
   }               
   Return: JSON String
   ********************************************************/
  async fundTransfer(data: any) {
    try {
      const userId = this.extractUserIdFromRequest();
      if (!userId) {
        return { status: 0, message: 'User ID not found in request' };
      }

      data.userId = userId;

      // Validate required fields
      const fieldsArray = ['registerId', 'amount', 'type', 'transactionPassword'];
      const emptyFields = this.checkEmptyFields(data, fieldsArray);
      if (emptyFields.length > 0) {
        return { status: 0, message: 'Please send ' + emptyFields.toString() + ' fields required.' };
      }

      // Get sender user details
      const user = await this.getUserDetails(userId);
      if (!user) {
        return { status: 0, message: 'User Not Found' };
      }

      // Verify transaction password
      const isPasswordValid = await this.verifyTransactionPassword(data.transactionPassword, user.transactionPassword);
      if (!isPasswordValid) {
        return { status: 0, message: 'Invalid transaction password' };
      }

      // Validate receiver user details
      const userDetails = await this.getUserByRegisterId(data.registerId);
      if (!userDetails) {
        return { status: 0, message: 'User details not found' };
      }

      // Ensure the registerId is not the same as the logged-in user's registerId
      if (user.registerId === data.registerId) {
        return { status: 0, message: 'Cannot transfer funds to the same registerId.' };
      }

      data.receiverUserId = userDetails._id;

      // Validate commission type and get key
      const key = this.getCommissionKey(data.type);
      if (!key) {
        return { status: 0, message: 'Please send proper type' };
      }

      // Validate sufficient balance (except for PRT Commission)
      if (key !== 'prtCommission') {
        const hasSufficientBalance = await this.validateSufficientBalance(userId, key, data.amount);
        if (!hasSufficientBalance) {
          return { status: 0, message: `There is no sufficient amount in ${data.type}` };
        }
      }

      // Generate transaction number
      const transactionNo = await this.generateTransactionNo();
      data.transactionNo = transactionNo;
      data.status = 'Pending';

      // Create funds transfer record
      const newFund = await this.fundsModel.create(data);
      if (!newFund) {
        return { status: 0, message: 'Failed to send funds' };
      }

      // Update wallet and commission details
      if (key !== 'prtCommission') {
        // Deduct from sender's commission
        await this.updateUserCommission(userId, key, -data.amount);
        
        // Add to receiver's funds
        await this.updateUserFunds(userDetails._id, data.amount);
      } else {
        // Handle PRT Commission (create PRT commission record)
        await this.createPRTCommissionRecord(user.registerId, data.amount);
      }

      // Update user metrics
      await this.updateUserMetrics(userId, key, data.amount, 'deduct');
      await this.updateUserMetrics(userDetails._id, key, data.amount, 'add');

      // Update fund status to Success
      await this.fundsModel.findByIdAndUpdate(
        newFund._id,
        { status: 'Success' },
        { new: true }
      );

      // Save transfer history
      await this.saveTransferHistory({
        senderUserId: userId,
        receiverUserId: userDetails._id,
        receiverCustomerRegisteredId: data.registerId,
        customerName: userDetails.fullName || 'Unknown Customer',
        commissionType: data.type,
        amount: data.amount,
        adminCharges: 0,
        netPayable: data.amount,
        fundsTransactionNo: transactionNo,
        status: 'Success'
      });

      return { status: 1, message: 'Funds sent successfully' };

    } catch (error) {
      console.log('error- ', error);
      return { status: 0, message: error.message || 'Internal server error' };
    }
  }

  /********************************************************
   Purpose: funds transfer history Listing
   Method: Post
   Authorisation: true
   Parameter:
   {
       "page":1,
       "pagesize":3,
       "startDate":"2022-09-20",
       "endDate":"2024-10-25",
       "searchText": ""
   }
   Return: JSON String
   ********************************************************/
  async fundsTransferHistoryListing(data: any) {
    try {
      const userId = this.extractUserIdFromRequest();
      if (!userId) {
        return { status: 0, message: 'User ID not found in request' };
      }

      const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
      const sort = data.sort ? data.sort : { _id: -1 };
      const limit = data.pagesize;

      // Build query conditions
      let queryConditions: any = { userId: userId };

      // Date filter
      if (data.startDate || data.endDate) {
        queryConditions.createdAt = {};
        if (data.startDate) {
          queryConditions.createdAt.$gte = new Date(data.startDate);
        }
        if (data.endDate) {
          queryConditions.createdAt.$lte = new Date(data.endDate);
        }
      }

      // Search filter
      if (data.searchText) {
        const regex = new RegExp(data.searchText, 'i');
        queryConditions.$or = [
          { type: regex },
          { transactionNo: regex }
        ];
      }

      // Get funds transfer history with user lookup
      const result = await this.fundsModel.aggregate([
        { $match: queryConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'receiverUserId',
            foreignField: '_id',
            as: 'receiver'
          }
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
        { $limit: limit },
      ]);

      // Get total count
      const total = await this.fundsModel.aggregate([
        { $match: queryConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'receiverUserId',
            foreignField: '_id',
            as: 'receiver'
          }
        },
        { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1 } },
      ]);

      return {
        status: 1,
        data: result,
        page: data.page,
        pagesize: data.pagesize,
        total: total.length,
      };

    } catch (error) {
      console.log('error- ', error);
      return { status: 0, message: 'Internal server error' };
    }
  }

  /********************************************************
   Purpose: funds received history Listing
   Method: Post
   Authorisation: true
   Parameter:
   {
       "page":1,
       "pagesize":3,
       "startDate":"2022-09-20",
       "endDate":"2024-10-25",
       "searchText": ""
   }
   Return: JSON String
   ********************************************************/
  async fundsReceivedHistoryListing(data: any) {
    try {
      const userId = this.extractUserIdFromRequest();
      if (!userId) {
        return { status: 0, message: 'User ID not found in request' };
      }

      const skip = (parseInt(data.page) - 1) * parseInt(data.pagesize);
      const sort = data.sort ? data.sort : { _id: -1 };
      const limit = data.pagesize;

      // Build query conditions
      let queryConditions: any = { receiverUserId: userId };

      // Date filter
      if (data.startDate || data.endDate) {
        queryConditions.createdAt = {};
        if (data.startDate) {
          queryConditions.createdAt.$gte = new Date(data.startDate);
        }
        if (data.endDate) {
          queryConditions.createdAt.$lte = new Date(data.endDate);
        }
      }

      // Search filter
      if (data.searchText) {
        const regex = new RegExp(data.searchText, 'i');
        queryConditions.$or = [
          { type: regex },
          { transactionNo: regex }
        ];
      }

      // Get funds received history with user lookup
      const result = await this.fundsModel.aggregate([
        { $match: queryConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'sender'
          }
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
        { $limit: limit },
      ]);

      // Get total count
      const total = await this.fundsModel.aggregate([
        { $match: queryConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'sender'
          }
        },
        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1 } },
      ]);

      return {
        status: 1,
        data: result,
        page: data.page,
        pagesize: data.pagesize,
        total: total.length,
      };

    } catch (error) {
      console.log('error- ', error);
      return { status: 0, message: 'Internal server error' };
    }
  }

  // Helper methods
  private extractUserIdFromRequest(): string | null {
    try {
      // Method 1: Extract from JWT token payload
      const authHeader = this.request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = this.decodeJwtToken(token);
        if (decoded && decoded.userId) {
          return decoded.userId;
        }
      }

      // Method 2: Extract from custom header
      const userIdHeader = this.request.headers['x-user-id'] as string;
      if (userIdHeader) {
        return userIdHeader;
      }

      // Method 3: Extract from request body or query params
      const bodyUserId = (this.request.body as any)?.userId;
      if (bodyUserId) {
        return bodyUserId;
      }

      const queryUserId = this.request.query.userId as string;
      if (queryUserId) {
        return queryUserId;
      }

      return null;
    } catch (error) {
      console.error('Error extracting user ID from request:', error);
      return null;
    }
  }

  private decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  private async getUserDetails(userId: string) {
    try {
      const response = await axios.get(
        `${appConfig.services.user.url}/users/${userId}`,
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  private async getUserByRegisterId(registerId: string) {
    try {
      const response = await axios.get(
        `${appConfig.services.user.url}/users/register/${registerId}`,
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user by register ID:', error);
      return null;
    }
  }

  private async verifyTransactionPassword(inputPassword: string, savedPassword: string): Promise<boolean> {
    try {
      // This would typically use proper password hashing
      // For now, using simple comparison
      return inputPassword === savedPassword;
    } catch (error) {
      console.error('Error verifying transaction password:', error);
      return false;
    }
  }

  private getCommissionKey(type: string): string | null {
    const commissionMap = {
      'Sponser Commission': 'sponserCommission',
      'Aur Commission': 'aurCommission',
      'Game Commission': 'gameCommission',
      'PRT Commission': 'prtCommission'
    };
    return commissionMap[type] || null;
  }

  private async validateSufficientBalance(userId: string, key: string, amount: number): Promise<boolean> {
    try {
      const userDetails = await this.getUserDetails(userId);
      if (!userDetails) {
        return false;
      }
      return userDetails[key] >= amount;
    } catch (error) {
      console.error('Error validating sufficient balance:', error);
      return false;
    }
  }

  private async generateTransactionNo(): Promise<string> {
    try {
      const fundsCount = await this.fundsModel.countDocuments();
      const randomGenerator = this.generateRandomString(8, 'capital');
      return 'F' + randomGenerator + (fundsCount + 1);
    } catch (error) {
      console.error('Error generating transaction number:', error);
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      return `F${timestamp}${random}`;
    }
  }

  private generateRandomString(length: number, type: string): string {
    const chars = type === 'capital' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async updateUserCommission(userId: string, key: string, amount: number) {
    try {
      const response = await axios.post(
        `${appConfig.services.user.url}/users/update-commission`,
        {
          userId: userId,
          commissionType: key,
          amount: amount,
          operation: amount > 0 ? 'add' : 'deduct'
        },
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error updating user commission:', error);
      return false;
    }
  }

  private async updateUserFunds(userId: string, amount: number) {
    try {
      const response = await axios.post(
        `${appConfig.services.user.url}/users/update-funds`,
        {
          userId: userId,
          amount: amount,
          operation: 'add'
        },
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error updating user funds:', error);
      return false;
    }
  }

  private async createPRTCommissionRecord(registerId: string, amount: number) {
    try {
      const response = await axios.post(
        `${appConfig.services.user.url}/users/prt-commission`,
        {
          registerId: registerId,
          prtCommission: amount,
          status: 'debited'
        },
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error creating PRT commission record:', error);
      return false;
    }
  }

  private async updateUserMetrics(userId: string, key: string, amount: number, operation: 'add' | 'deduct') {
    try {
      const response = await axios.post(
        `${appConfig.services.user.url}/users/metrics`,
        {
          userId: userId,
          commissionType: key,
          amount: amount,
          operation: operation
        },
        { 
          timeout: appConfig.services.user.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.request.headers.authorization || ''
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error updating user metrics:', error);
      return false;
    }
  }

  private checkEmptyFields(data: any, fieldsArray: string[]): string[] {
    const emptyFields: string[] = [];
    for (const field of fieldsArray) {
      if (!data[field] || data[field] === '') {
        emptyFields.push(field);
      }
    }
    return emptyFields;
  }

  private async saveTransferHistory(historyData: any) {
    try {
      const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:3005';
      await axios.post(`${historyServiceUrl}/funds-transfer-history/save-transfer`, historyData, {
        timeout: 5000
      });
    } catch (error) {
      console.error('Error saving transfer history:', error.message);
    }
  }
} 