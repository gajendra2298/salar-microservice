import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamLevels, TeamLevelsDocument } from '../schemas/team-levels.schema';
import { GetPendingTeamMembersDto } from '../dto/get-pending-team-members.dto';
import { AddTeamMemberDto } from '../dto/add-team-member.dto';
import { GetTeamTreeDto } from '../dto/get-team-tree.dto';
import * as _ from 'lodash';

@Injectable()
export class ProductTeamService {
  constructor(
    @InjectModel(TeamLevels.name) private teamLevelsModel: Model<TeamLevelsDocument>,
  ) {}

  async getPendingTeamMembers(data: GetPendingTeamMembersDto, userId: string): Promise<any> {
    try {
      // This would typically connect to a Users collection
      // For now, we'll return a mock response
      const user = { registerId: 'TEST001' }; // Mock user
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let query: any = {};
      if (data.searchText) {
        const regex = {
          $regex: `.*${data.searchText}.*`,
          $options: 'i',
        };
        query = {
          $or: [
            { emailId: regex },
            { fullName: regex },
            { organisationName: regex },
            { registerId: regex },
          ],
        };
      }

      // Mock pending users - in real implementation, this would query the Users collection
      const pendingUsers = [
        {
          _id: new Types.ObjectId(),
          ulDownlineId: 'TEST001',
          registerId: 'PEND001',
          emailId: 'pending1@example.com',
          fullName: 'Pending User 1',
          organisationName: 'Test Org 1',
        },
        {
          _id: new Types.ObjectId(),
          ulDownlineId: 'TEST001',
          registerId: 'PEND002',
          emailId: 'pending2@example.com',
          fullName: 'Pending User 2',
          organisationName: 'Test Org 2',
        },
      ];

      return {
        status: 1,
        data: pendingUsers,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getPendingLevelDetails(userId: string): Promise<any> {
    try {
      const user = { registerId: 'TEST001', fullName: 'Test User', organisationName: 'Test Org', emailId: 'test@example.com' };
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1, depth: 1 });
      if (_.isEmpty(teamLevels)) {
        teamLevels = { depth: 1, width: 1 } as any;
      }

      // Mock pending levels data
      const pendingLevels = [
        {
          level: 1,
          vacantPlace: 2,
          fullName: user.fullName,
          emailId: user.emailId,
          registerId: user.registerId,
          _id: new Types.ObjectId(),
        },
        {
          level: 2,
          vacantPlace: 3,
          fullName: 'Level 2 User',
          emailId: 'level2@example.com',
          registerId: 'L2U001',
          _id: new Types.ObjectId(),
        },
      ];

      return {
        status: 1,
        data: pendingLevels,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async addTeamMember(data: AddTeamMemberDto, userId: string): Promise<any> {
    try {
      const user = { registerId: 'TEST001' };
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      // Mock validation - in real implementation, this would validate against Users collection
      const validUser = { _id: new Types.ObjectId(), level: -1 };
      
      if (_.isEmpty(validUser)) {
        return {
          status: 0,
          message: 'User is already allocated to other team',
        };
      }

      const teamMemberDetails = { registerId: 'TM001' };
      
      if (_.isEmpty(teamMemberDetails)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1 });
      
      if (_.isEmpty(teamLevels)) {
        teamLevels = { width: 1 } as any;
      }

      let level = -1;
      const usersCount = 2; // Mock count
      level = usersCount < teamLevels.width ? 1 : -1;

      if (level == -1) {
        return {
          status: 0,
          message: 'There is no place for this user, under this team member',
        };
      }

      // Mock update - in real implementation, this would update the Users collection
      const updatedUser = { _id: new Types.ObjectId() };
      
      if (_.isEmpty(updatedUser)) {
        return {
          status: 0,
          message: 'User details not updated',
        };
      }

      return {
        status: 1,
        message: 'User details updated successfully',
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getTeamTreeDetails(userId: string): Promise<any> {
    try {
      const user = { registerId: 'TEST001' };
      
      if (!user) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1, depth: 1 });
      
      if (!teamLevels) {
        teamLevels = { depth: 1, width: 1 } as any;
      }

      // Mock team tree data
      const levels = [
        {
          level: 1,
          requiredMembers: teamLevels.width,
          joinedMembers: 2,
          status: 'Pending',
          earnings: 0,
          users: [
            {
              _id: new Types.ObjectId(),
              registerId: 'U001',
              emailId: 'user1@example.com',
              fullName: 'User 1',
              imageUrl: 'https://example.com/image1.jpg',
              createdAt: new Date(),
              gender: 'male',
              mainUser: {
                _id: new Types.ObjectId(),
                fullName: 'Main User',
                emailId: 'main@example.com',
                registerId: 'MAIN001',
              },
            },
            {
              _id: new Types.ObjectId(),
              registerId: 'U002',
              emailId: 'user2@example.com',
              fullName: 'User 2',
              imageUrl: 'https://example.com/image2.jpg',
              createdAt: new Date(),
              gender: 'female',
              mainUser: {
                _id: new Types.ObjectId(),
                fullName: 'Main User',
                emailId: 'main@example.com',
                registerId: 'MAIN001',
              },
            },
          ],
        },
        {
          level: 2,
          requiredMembers: teamLevels.width * 2,
          joinedMembers: 3,
          status: 'Pending',
          earnings: 0,
          users: [
            {
              _id: new Types.ObjectId(),
              registerId: 'U003',
              emailId: 'user3@example.com',
              fullName: 'User 3',
              imageUrl: 'https://example.com/image3.jpg',
              createdAt: new Date(),
              gender: 'male',
              mainUser: {
                _id: new Types.ObjectId(),
                fullName: 'Level 1 User',
                emailId: 'level1@example.com',
                registerId: 'L1U001',
              },
            },
          ],
        },
      ];

      return {
        status: 1,
        data: levels,
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getTeamTreeDetailsByRegisterId(registerId: string, level?: number): Promise<any> {
    try {
      const user = { registerId: 'TEST001' };
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1, depth: 1 });
      
      if (_.isEmpty(teamLevels)) {
        teamLevels = { depth: 1, width: 1 } as any;
      }

      // Mock level data
      const levelData = {
        level: level || 1,
        requiredMembers: teamLevels.width,
        joinedMembers: 2,
        status: 'Pending',
        earnings: 0,
      };

      return {
        status: 1,
        data: levelData,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getFirstLevelDetails(registerId: string): Promise<any> {
    try {
      const user = { registerId: 'TEST001' };
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1 });
      
      if (_.isEmpty(teamLevels)) {
        teamLevels = { width: 1 } as any;
      }

      const usersCount = 2; // Mock count
      const userDetails = {
        requiredMembers: teamLevels.width,
        joinedMembers: usersCount,
        status: teamLevels.width - usersCount == 0 ? 'Completed' : 'Pending',
        earnings: 0,
      };

      return {
        status: 1,
        data: userDetails,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getNetworkTeamCount(userId: string): Promise<any> {
    try {
      const user = { registerId: 'TEST001' };
      
      if (_.isEmpty(user)) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1, depth: 1 });
      
      if (_.isEmpty(teamLevels)) {
        teamLevels = { depth: 1, width: 1 } as any;
      }

      // Mock network team count
      const count = { networkTeamCount: 5 };

      return {
        status: 1,
        data: count,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }
} 