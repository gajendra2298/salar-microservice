import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamLevels, TeamLevelsDocument } from '../schemas/team-levels.schema';
import { TeamMember, TeamMemberDocument } from '../schemas/team-member.schema';
import { GetPendingTeamMembersDto } from '../dto/get-pending-team-members.dto';
import { AddTeamMemberDto } from '../dto/add-team-member.dto';
import { GetTeamTreeDto } from '../dto/get-team-tree.dto';
import * as mockUserData from '../mock-data/user-details.mock.json';
import * as _ from 'lodash';

@Injectable()
export class ProductTeamService {
  private mockUsers = mockUserData.users;

  constructor(
    @InjectModel(TeamLevels.name) private teamLevelsModel: Model<TeamLevelsDocument>,
    @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  async getPendingTeamMembers(data: GetPendingTeamMembersDto, userId: string): Promise<any> {
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
        return {
          status: 0,
          message: 'User not found',
        };
      }

      // Get pending users from mock data (users not in team)
      let pendingUsers = this.mockUsers.filter(u => 
        u.registerId !== userId && 
        u.ulDownlineId === user.ulDownlineId &&
        !u.isDeleted
      );

      // Apply search filter
      if (data.searchText) {
        const searchText = data.searchText.toLowerCase();
        pendingUsers = pendingUsers.filter(u =>
          u.emailId.toLowerCase().includes(searchText) ||
          u.fullName.toLowerCase().includes(searchText) ||
          u.registerId.toLowerCase().includes(searchText)
        );
      }

      // Check if users are already in team (from MongoDB)
      const teamMembers = await this.teamMemberModel.find({ 
        isDeleted: false, 
        status: true 
      }).select('registerId');

      const teamMemberIds = teamMembers.map(tm => tm.registerId);
      
      // Filter out users already in team
      pendingUsers = pendingUsers.filter(u => !teamMemberIds.includes(u.registerId));

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
        return {
          status: 0,
          message: 'User not found',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1, depth: 1 });
      if (_.isEmpty(teamLevels)) {
        teamLevels = { depth: 1, width: 1 } as any;
      }

      // Get team members from MongoDB
      const teamMembers = await this.teamMemberModel.find({ 
        isDeleted: false, 
        status: true 
      });

      // Calculate pending levels based on actual team data
      const pendingLevels = [];
      
      for (let level = 1; level <= teamLevels.depth; level++) {
        const levelMembers = teamMembers.filter(tm => tm.level === level);
        const vacantPlace = teamLevels.width - levelMembers.length;
        
        if (vacantPlace > 0) {
          pendingLevels.push({
            level,
            vacantPlace,
            fullName: user.fullName,
            emailId: user.emailId,
            registerId: user.registerId,
            _id: new Types.ObjectId(),
          });
        }
      }

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
      // Find sponsor user from mock data - try multiple ways to find the user
      let sponsorUser = this.mockUsers.find(u => u.registerId === userId);
      
      if (_.isEmpty(sponsorUser)) {
        // Try to find by _id if userId is a MongoDB ObjectId
        sponsorUser = this.mockUsers.find(u => u._id === userId);
      }
      
      if (_.isEmpty(sponsorUser)) {
        // Try to find by emailId
        sponsorUser = this.mockUsers.find(u => u.emailId === userId);
      }
      
      if (_.isEmpty(sponsorUser)) {
        return {
          status: 0,
          message: 'Sponsor user not found',
        };
      }

      // Find team member user from mock data - try multiple ways to find the user
      let teamMemberUser = this.mockUsers.find(u => u._id === data.teamMemberId);
      
      if (_.isEmpty(teamMemberUser)) {
        // Try to find by registerId
        teamMemberUser = this.mockUsers.find(u => u.registerId === data.teamMemberId);
      }
      
      if (_.isEmpty(teamMemberUser)) {
        // Try to find by emailId
        teamMemberUser = this.mockUsers.find(u => u.emailId === data.teamMemberId);
      }
      
      if (_.isEmpty(teamMemberUser)) {
        return {
          status: 0,
          message: 'Team member user not found',
        };
      }

      // Check if user is already in team (from MongoDB) - use the actual user ID from mock data
      const existingTeamMember = await this.teamMemberModel.findOne({ 
        userId: new Types.ObjectId(teamMemberUser._id),
        isDeleted: false 
      });
      
      if (existingTeamMember) {
        return {
          status: 0,
          message: 'User is already allocated to other team',
        };
      }

      let teamLevels = await this.teamLevelsModel.findOne({ isDeleted: false, status: true }, { width: 1 });
      
      if (_.isEmpty(teamLevels)) {
        teamLevels = { width: 1 } as any;
      }

      // Get current level members count from MongoDB for this sponsor
      const currentLevelMembers = await this.teamMemberModel.countDocuments({ 
        parentId: new Types.ObjectId(sponsorUser._id),
        level: 1,
        isDeleted: false, 
        status: true 
      });

      let level = 1; // Always start with level 1 for now
      
      // Check if there's space in level 1
      if (currentLevelMembers >= teamLevels.width) {
        return {
          status: 0,
          message: 'There is no place for this user, under this team member',
        };
      }

      // Create new team member in MongoDB
      const newTeamMember = new this.teamMemberModel({
        userId: new Types.ObjectId(teamMemberUser._id),
        registerId: teamMemberUser.registerId,
        sponsorId: sponsorUser.sponserId,
        ulDownlineId: teamMemberUser.ulDownlineId,
        level: level,
        position: currentLevelMembers + 1,
        parentId: new Types.ObjectId(sponsorUser._id),
        joinedAt: new Date()
      });

      console.log('Saving team member:', {
        userId: teamMemberUser._id,
        registerId: teamMemberUser.registerId,
        sponsorId: sponsorUser.sponserId,
        level: level,
        position: currentLevelMembers + 1,
        parentId: sponsorUser._id
      });

      const savedTeamMember = await newTeamMember.save();
      
      if (_.isEmpty(savedTeamMember)) {
        return {
          status: 0,
          message: 'User details not updated',
        };
      }

      console.log('Team member saved successfully:', savedTeamMember._id);

      return {
        status: 1,
        message: 'User details updated successfully',
        data: savedTeamMember,
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }

  async getTeamTreeDetails(userId: string): Promise<any> {
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

      // Get team members from MongoDB
      const teamMembers = await this.teamMemberModel.find({ 
        isDeleted: false, 
        status: true 
      }).sort({ level: 1, position: 1 });

      // Group team members by level
      const levels = [];
      
      for (let level = 1; level <= teamLevels.depth; level++) {
        const levelMembers = teamMembers.filter(tm => tm.level === level);
        const requiredMembers = teamLevels.width * Math.pow(2, level - 1);
        const joinedMembers = levelMembers.length;
        const status = joinedMembers >= requiredMembers ? 'Completed' : 'Pending';
        
        // Get user details from mock data for each team member
        const users = levelMembers.map(tm => {
          const userDetails = this.mockUsers.find(u => u._id === tm.userId.toString());
          return {
            _id: tm._id,
            registerId: tm.registerId,
            emailId: userDetails?.emailId || '',
            fullName: userDetails?.fullName || '',
            imageUrl: userDetails?.imageUrl || '',
            createdAt: tm.joinedAt,
            gender: userDetails?.gender || 'male',
            mainUser: {
              _id: new Types.ObjectId(user._id),
              fullName: user.fullName,
              emailId: user.emailId,
              registerId: user.registerId,
            },
          };
        });

        levels.push({
          level,
          requiredMembers,
          joinedMembers,
          status,
          earnings: 0,
          users,
        });
      }

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
        return {
          status: 0,
          message: 'User not found',
        };
      }

      // Get total team members count from MongoDB
      const networkTeamCount = await this.teamMemberModel.countDocuments({ 
        isDeleted: false, 
        status: true 
      });

      return {
        status: 1,
        data: { networkTeamCount },
      };
    } catch (error) {
      console.log('error- ', error);
      throw error;
    }
  }
} 