import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Funds, FundsDocument } from './schemas/funds.schema';
import { FundsReceivedResponseDto } from './dto/funds-received.dto';

@Injectable()
export class FundsReceivedService {
  constructor(
    @InjectModel(Funds.name) private fundsModel: Model<FundsDocument>,
  ) {}

  async fundsReceivedHistoryListing(data: {
    userId: string;
    page: number;
    pagesize: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
    sort?: any;
  }): Promise<FundsReceivedResponseDto> {
    try {
      const { userId, page, pagesize, startDate, endDate, searchText, sort } = data;
      const skip = (parseInt(page.toString()) - 1) * parseInt(pagesize.toString());
      const sortOption = sort || { _id: -1 };
      const limit = pagesize;

      // Build query conditions
      const matchConditions: any = { receiverUserId: userId };

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
            localField: 'userId',
            foreignField: '_id',
            as: 'sender',
          },
        },
        { $unwind: { path: '$sender', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1 } },
      ];

      const total = await this.fundsModel.aggregate(totalPipeline);
      const totalCount = total.length;
      const totalPages = Math.ceil(totalCount / pagesize);

      return {
        data: result,
        page,
        pagesize,
        total: totalCount,
        totalPages,
      };
    } catch (error) {
      console.error('Error in funds received history listing:', error);
      // Return empty response with error structure
      return {
        data: [],
        page: 1,
        pagesize: 10,
        total: 0,
        totalPages: 0,
      };
    }
  }
} 