import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SponsorTeam, SponsorTeamDocument } from '../schemas/sponsor-team.schema';
import { AddSponsorTeamDto } from '../dto/add-sponsor-team.dto';
import { GetSponsorTeamDto } from '../dto/get-sponsor-team.dto';
import * as moment from 'moment';

@Injectable()
export class SponsorTeamService {
  constructor(
    @InjectModel(SponsorTeam.name) private sponsorTeamModel: Model<SponsorTeamDocument>,
  ) {}

  async addSponsorTeam(data: AddSponsorTeamDto): Promise<any> {
    try {
      const newSponsorTeam = new this.sponsorTeamModel(data);
      const savedSponsorTeam = await newSponsorTeam.save();
      
      if (!savedSponsorTeam) {
        return {
          status: 0,
          message: 'Sponsor team member not saved',
        };
      }
      
      return {
        status: 1,
        message: 'Sponsor team member added successfully',
        data: savedSponsorTeam,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getSponsorTeam(data: GetSponsorTeamDto, userId: string): Promise<any> {
    try {
      // Build the query
      let query: any = { sponsor_id: userId };

      // Search by user_name or registerId if searchText is provided
      if (data.searchText) {
        const searchRegex = new RegExp(data.searchText, 'i');
        query = {
          ...query,
          $or: [
            { user_name: searchRegex },
            { registerId: searchRegex },
          ],
        };
      }

      // Filtering by createdAt date
      if (data.filter?.startDate || data.filter?.endDate) {
        let dateFilter: any = {};
        if (data.filter.startDate) {
          dateFilter.$gte = moment(data.filter.startDate, 'YYYY-MM-DD').startOf('day').toDate();
        }
        if (data.filter.endDate) {
          dateFilter.$lte = moment(data.filter.endDate, 'YYYY-MM-DD').endOf('day').toDate();
        }
        query = {
          ...query,
          createdAt: dateFilter,
        };
      }

      // Pagination parameters
      const currentPage = parseInt(data.currentPage?.toString()) || 1;
      const itemsPerPage = parseInt(data.itemsPerPage?.toString()) || 10;
      const skip = (currentPage - 1) * itemsPerPage;

      // Aggregation pipeline
      const result = await this.sponsorTeamModel.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            user_name: '$userDetails.fullName',
            email_id: 1,
            registerId: 1,
            sponsor_name: 1,
            sponsor_id: 1,
            doj: 1,
            createdAt: 1,
            profileImg: '$userDetails.imageUrl',
            gender: '$userDetails.gender',
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);

      // Count total matching documents
      const totalCount = await this.sponsorTeamModel.countDocuments(query);

      return {
        status: 1,
        data: result,
        count: totalCount,
        pagination: {
          currentPage,
          itemsPerPage,
          totalPages: Math.ceil(totalCount / itemsPerPage),
        },
      };
    } catch (error) {
      console.error('error-', error);
      throw error;
    }
  }
} 