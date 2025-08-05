import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Funds, FundsDocument } from './schemas/funds.schema';

@Injectable()
export class FundsTransferHistoryService {
  constructor(
    @InjectModel(Funds.name) private fundsModel: Model<FundsDocument>,
  ) {}

  async fundsTransferHistoryListing(data: {
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
        ];
      }

      // Aggregate pipeline
      const pipeline = [
        { $match: matchConditions },
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
        { $sort: sortOption },
        { $skip: skip },
        { $limit: limit },
      ];

      const result = await this.fundsModel.aggregate(pipeline);

      // Get total count
      const totalPipeline = [
        { $match: matchConditions },
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
      ];

      const total = await this.fundsModel.aggregate(totalPipeline);

      return {
        status: 1,
        data: result,
        page,
        pagesize,
        total: total.length,
      };
    } catch (error) {
      console.error('Error in funds transfer history listing:', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }
} 