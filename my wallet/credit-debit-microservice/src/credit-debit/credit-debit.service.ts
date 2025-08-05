import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditDebit, CreditDebitDocument } from './schemas/credit-debit.schema';

@Injectable()
export class CreditDebitService {
  constructor(
    @InjectModel(CreditDebit.name) private creditDebitModel: Model<CreditDebitDocument>,
  ) {}

  async creditDebitListing(data: {
    userId: string;
    page: number;
    pagesize: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
    sort?: any;
  }) {
    try {
      const { userId, page, pagesize, startDate, endDate, searchText, sort } = data;
      const skip = (parseInt(page.toString()) - 1) * parseInt(pagesize.toString());
      const sortOption = sort || { _id: -1 };
      const limit = pagesize;

      // Build query conditions
      const matchConditions: any = { userId };

      // Date filter
      if (startDate || endDate) {
        const dateFilter: any = {};
        if (startDate) {
          dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
          dateFilter.$lte = new Date(endDate);
        }
        matchConditions.createdAt = dateFilter;
      }

      // Search filter
      if (searchText) {
        const searchRegex = { $regex: `.*${searchText}.*`, $options: 'i' };
        matchConditions.$or = [
          { type: searchRegex },
          { transactionNo: searchRegex },
          { reason: searchRegex },
          { status: searchRegex },
          { orderId: searchRegex },
        ];
      }

      // Aggregate pipeline
      const pipeline = [
        { $match: matchConditions },
        {
          $project: {
            createdAt: 1,
            transactionNo: 1,
            status: 1,
            type: 1,
            amount: 1,
            reason: 1,
            orderId: 1,
          },
        },
        { $sort: sortOption },
        { $skip: skip },
        { $limit: limit },
      ];

      const result = await this.creditDebitModel.aggregate(pipeline);

      // Get total count
      const totalPipeline = [
        { $match: matchConditions },
        { $project: { _id: 1 } },
      ];

      const total = await this.creditDebitModel.aggregate(totalPipeline);

      return {
        status: 1,
        data: result,
        page,
        pagesize,
        total: total.length,
      };
    } catch (error) {
      console.error('Error in credit/debit listing:', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  async createCreditDebit(creditDebitData: {
    userId: string;
    reason: string;
    orderId?: string;
    status: 'Credited' | 'Debited';
    type: string;
    amount: number;
  }) {
    try {
      // Generate transaction number
      const creditDebitCount = await this.creditDebitModel.countDocuments();
      const randomGenerator = this.generateRandomString(8);
      const transactionNo = 'CD' + randomGenerator + (creditDebitCount + 1);

      const newCreditDebit = await this.creditDebitModel.create({
        ...creditDebitData,
        transactionNo,
      });

      return {
        status: 1,
        message: 'Credit/Debit transaction created successfully',
        data: newCreditDebit,
      };
    } catch (error) {
      console.error('Error creating credit/debit transaction:', error);
      return {
        status: 0,
        message: 'Failed to create credit/debit transaction',
      };
    }
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
} 