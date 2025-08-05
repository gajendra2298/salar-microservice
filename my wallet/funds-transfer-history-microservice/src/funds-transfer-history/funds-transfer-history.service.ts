import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Funds, FundsDocument } from './schemas/funds.schema';

export interface TransferHistoryData {
  senderUserId: string;
  receiverUserId: string;
  receiverCustomerRegisteredId: string;
  customerName: string;
  commissionType: string;
  amount: number;
  adminCharges: number;
  netPayable: number;
  fundsTransactionNo: string;
  status: 'Success' | 'Failed';
  failureReason?: string;
}

@Injectable()
export class FundsTransferHistoryService {
  constructor(
    @InjectModel(Funds.name) private fundsModel: Model<FundsDocument>,
  ) {}

  async saveTransferHistory(transferData: TransferHistoryData): Promise<any> {
    try {
      const newTransferHistory = new this.fundsModel({
        senderUserId: transferData.senderUserId,
        receiverUserId: transferData.receiverUserId,
        receiverCustomerRegisteredId: transferData.receiverCustomerRegisteredId,
        customerName: transferData.customerName,
        commissionType: transferData.commissionType,
        amount: transferData.amount,
        adminCharges: transferData.adminCharges,
        netPayable: transferData.netPayable,
        fundsTransactionNo: transferData.fundsTransactionNo,
        status: transferData.status,
        failureReason: transferData.failureReason,
        transferDate: new Date()
      });

      const savedHistory = await newTransferHistory.save();

      return {
        success: true,
        message: 'Transfer history saved successfully',
        data: {
          serialNo: savedHistory.serialNo,
          transferDate: savedHistory.transferDate,
          receiverCustomerRegisteredId: savedHistory.receiverCustomerRegisteredId,
          customerName: savedHistory.customerName,
          fundsTransactionNo: savedHistory.fundsTransactionNo,
          status: savedHistory.status
        }
      };
    } catch (error) {
      throw new HttpException(
        'Error saving transfer history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTransferHistory(userId?: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      
      let query = {};
      if (userId) {
        query = {
          $or: [
            { senderUserId: userId },
            { receiverUserId: userId }
          ]
        };
      }

      const transferHistory = await this.fundsModel
        .find(query)
        .sort({ transferDate: -1, serialNo: -1 })
        .skip(skip)
        .limit(limit)
        .select('serialNo transferDate receiverCustomerRegisteredId customerName fundsTransactionNo status');

      const totalCount = await this.fundsModel.countDocuments(query);

      const formattedHistory = transferHistory.map(record => ({
        serialNo: record.serialNo,
        date: record.transferDate.toLocaleDateString(),
        receiverCustomerRegisteredId: record.receiverCustomerRegisteredId,
        customerName: record.customerName,
        fundsTransactionNo: record.fundsTransactionNo,
        status: record.status
      }));

      return {
        success: true,
        message: 'Transfer history retrieved successfully',
        data: {
          history: formattedHistory,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalRecords: totalCount,
            recordsPerPage: limit
          }
        }
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving transfer history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 