import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async getWalletBalance(userId: string) {
    try {
      let wallet = await this.walletModel.findOne({ userId }).exec();
      
      if (!wallet) {
        // Create new wallet if doesn't exist
        wallet = await this.walletModel.create({ userId });
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
      const wallet = await this.walletModel.findOneAndUpdate(
        { userId },
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
        data: wallet,
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