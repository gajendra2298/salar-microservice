import { Model } from 'mongoose';
import { FundsDocument } from './schemas/funds.schema';
export declare class FundsTransferService {
    private fundsModel;
    constructor(fundsModel: Model<FundsDocument>);
    getDropdownValuesForFunds(userId: string): Promise<{
        status: number;
        message: string;
        data: any;
    }>;
    fundTransfer(transferData: {
        userId: string;
        registerId: string;
        amount: number;
        type: string;
        transactionPassword: string;
    }): Promise<{
        status: number;
        message: string;
        data: {
            transactionNo: string;
            amount: number;
            netPayable: number;
            adminCharges: number;
            receiverId: string;
            type: string;
            status: string;
        };
    }>;
    private generateRandomString;
}
