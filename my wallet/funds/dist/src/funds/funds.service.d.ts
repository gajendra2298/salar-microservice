import { Model, Types } from 'mongoose';
import { Funds, FundsDocument } from './schemas/funds.schema';
import { FundTransferDto } from './dto/fund-transfer.dto';
import { FundHistoryDto } from './dto/fund-history.dto';
export declare class FundsService {
    private fundsModel;
    private mockUsers;
    constructor(fundsModel: Model<FundsDocument>);
    private generateTransactionNo;
    private generateRandomString;
    private getMockUserData;
    private getMockUserByRegisterId;
    private verifyTransactionPassword;
    private checkUserBalance;
    getDropdownValuesForFunds(userId: string): Promise<{
        status: number;
        message: string;
        data: {
            sponserCommission: number;
            aurCommission: number;
            gameCommission: number;
            funds: number;
            prtCommission: number;
        };
    }>;
    fundTransfer(userId: string, fundTransferDto: FundTransferDto): Promise<{
        status: number;
        message: string;
        data: {
            transactionNo: string;
            amount: number;
            receiverName: string;
            receiverRegisterId: string;
        };
    }>;
    private getBalanceKey;
    getAllFundRecordsByUserId(userId: string): Promise<{
        status: number;
        message: string;
        data: (import("mongoose").Document<unknown, {}, FundsDocument> & Funds & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        })[];
        total: number;
    }>;
    getFundRecordByTransactionNo(transactionNo: string): Promise<{
        status: number;
        message: string;
        data: import("mongoose").Document<unknown, {}, FundsDocument> & Funds & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        };
    }>;
    getFundStatisticsByUserId(userId: string): Promise<{
        status: number;
        message: string;
        data: {
            sent: any;
            received: any;
            netAmount: number;
        };
    }>;
    fundsTransferHistoryListing(userId: string, historyDto: FundHistoryDto): Promise<{
        status: number;
        data: any[];
        page: number;
        pagesize: number;
        total: number;
    }>;
    fundsReceivedHistoryListing(userId: string, historyDto: FundHistoryDto): Promise<{
        status: number;
        data: any[];
        page: number;
        pagesize: number;
        total: number;
    }>;
}
