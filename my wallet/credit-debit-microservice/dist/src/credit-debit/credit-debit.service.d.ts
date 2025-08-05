import { Model } from 'mongoose';
import { CreditDebit, CreditDebitDocument } from './schemas/credit-debit.schema';
export declare class CreditDebitService {
    private creditDebitModel;
    constructor(creditDebitModel: Model<CreditDebitDocument>);
    creditDebitListing(data: {
        userId: string;
        page: number;
        pagesize: number;
        startDate?: string;
        endDate?: string;
        searchText?: string;
        sort?: any;
    }): Promise<{
        status: number;
        data: any[];
        page: number;
        pagesize: number;
        total: number;
        message?: undefined;
    } | {
        status: number;
        message: string;
        data?: undefined;
        page?: undefined;
        pagesize?: undefined;
        total?: undefined;
    }>;
    createCreditDebit(creditDebitData: {
        userId: string;
        reason: string;
        orderId?: string;
        status: 'Credited' | 'Debited';
        type: string;
        amount: number;
    }): Promise<{
        status: number;
        message: string;
        data: import("mongoose").Document<unknown, {}, CreditDebitDocument> & CreditDebit & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    } | {
        status: number;
        message: string;
        data?: undefined;
    }>;
    private generateRandomString;
}
