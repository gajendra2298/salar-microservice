import { Model } from 'mongoose';
import { FundsDocument } from './schemas/funds.schema';
import { Request } from 'express';
export declare class FundsTransferService {
    private fundsModel;
    private readonly request;
    constructor(fundsModel: Model<FundsDocument>, request: Request);
    getDropdownValuesForFunds(): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: {
            sponserCommission: any;
            aurCommission: any;
            gameCommission: any;
            funds: any;
        };
    }>;
    fundTransfer(data: any): Promise<{
        status: number;
        message: any;
    }>;
    fundsTransferHistoryListing(data: any): Promise<{
        status: number;
        message: string;
        data?: undefined;
        page?: undefined;
        pagesize?: undefined;
        total?: undefined;
    } | {
        status: number;
        data: any[];
        page: any;
        pagesize: any;
        total: number;
        message?: undefined;
    }>;
    fundsReceivedHistoryListing(data: any): Promise<{
        status: number;
        message: string;
        data?: undefined;
        page?: undefined;
        pagesize?: undefined;
        total?: undefined;
    } | {
        status: number;
        data: any[];
        page: any;
        pagesize: any;
        total: number;
        message?: undefined;
    }>;
    private extractUserIdFromRequest;
    private decodeJwtToken;
    private getUserDetails;
    private getUserByRegisterId;
    private verifyTransactionPassword;
    private getCommissionKey;
    private validateSufficientBalance;
    private generateTransactionNo;
    private generateRandomString;
    private updateUserCommission;
    private updateUserFunds;
    private createPRTCommissionRecord;
    private updateUserMetrics;
    private checkEmptyFields;
    private saveTransferHistory;
}
