import { Model } from 'mongoose';
import { FundsDocument } from './schemas/funds.schema';
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
export declare class FundsTransferHistoryService {
    private fundsModel;
    constructor(fundsModel: Model<FundsDocument>);
    saveTransferHistory(transferData: TransferHistoryData): Promise<any>;
    getTransferHistory(userId?: string, page?: number, limit?: number): Promise<any>;
}
