import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import * as mockUserData from './mock-data/user-details.mock.json';
import * as _ from 'lodash';

@Injectable()
export class WalletService {
  private mockUsers = mockUserData.users;

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async getWalletBalance(userId: string) {
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

      // Get wallet from MongoDB
      let wallet = await this.walletModel.findOne({ userId: new Types.ObjectId(user._id) }).exec();
      
      if (!wallet) {
        // Create new wallet if doesn't exist with mock data
        wallet = await this.walletModel.create({ 
          userId: new Types.ObjectId(user._id),
          referralComm: user.referralComm || 0,
          sponsorComm: user.sponsorComm || 0,
          ausComm: user.ausComm || 0,
          productTeamReferralCommission: user.productTeamReferralCommission || 0,
          novaReferralCommission: user.novaReferralCommission || 0,
          royaltyReferralTeamCommission: user.royaltyReferralTeamCommission || 0,
          shoppingAmount: user.shoppingAmount || 0,
          salarCoins: user.salarCoins || 0,
          royaltyCredits: user.royaltyCredits || 0,
          salarGiftCredits: user.salarGiftCredits || 0,
          funds: user.funds || 0,
        });
      }

      // Calculate available balance
      const availableBalance = 
        wallet.referralComm +
        wallet.sponsorComm +
        wallet.ausComm +
        wallet.productTeamReferralCommission +
        wallet.novaReferralCommission +
        wallet.royaltyReferralTeamCommission +
        wallet.shoppingAmount +
        wallet.salarCoins +
        wallet.royaltyCredits +
        wallet.salarGiftCredits +
        wallet.funds;

      // Update available balance
      wallet.availableBalance = availableBalance;
      await wallet.save();

      return {
        status: 1,
        message: 'Wallet balance retrieved successfully',
        data: {
          userId: user._id,
          fullName: user.fullName,
          emailId: user.emailId,
          registerId: user.registerId,
          referralComm: wallet.referralComm,
          sponsorComm: wallet.sponsorComm,
          ausComm: wallet.ausComm,
          productTeamReferralCommission: wallet.productTeamReferralCommission,
          novaReferralCommission: wallet.novaReferralCommission,
          royaltyReferralTeamCommission: wallet.royaltyReferralTeamCommission,
          shoppingAmount: wallet.shoppingAmount,
          salarCoins: wallet.salarCoins,
          royaltyCredits: wallet.royaltyCredits,
          salarGiftCredits: wallet.salarGiftCredits,
          funds: wallet.funds,
          availableBalance: wallet.availableBalance,
        },
      };
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return {
        status: 0,
        message: 'Failed to get wallet balance',
      };
    }
  }

  async updateWalletBalance(userId: string, updates: Partial<Wallet>) {
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

      const wallet = await this.walletModel.findOneAndUpdate(
        { userId: new Types.ObjectId(user._id) },
        { $inc: updates },
        { new: true, upsert: true },
      );

      // Recalculate available balance
      const availableBalance = 
        wallet.referralComm +
        wallet.sponsorComm +
        wallet.ausComm +
        wallet.productTeamReferralCommission +
        wallet.novaReferralCommission +
        wallet.royaltyReferralTeamCommission +
        wallet.shoppingAmount +
        wallet.salarCoins +
        wallet.royaltyCredits +
        wallet.salarGiftCredits +
        wallet.funds;

      wallet.availableBalance = availableBalance;
      await wallet.save();

      return {
        status: 1,
        message: 'Wallet balance updated successfully',
        data: {
          userId: user._id,
          fullName: user.fullName,
          emailId: user.emailId,
          registerId: user.registerId,
          ...wallet.toObject(),
        },
      };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return {
        status: 0,
        message: 'Failed to update wallet balance',
      };
    }
  }
} 