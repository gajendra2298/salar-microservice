import { CreditDebitService } from './credit-debit.service';
export declare class CreditDebitController {
    private readonly creditDebitService;
    constructor(creditDebitService: CreditDebitService);
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
        data: import("mongoose").Document<unknown, {}, import("./schemas/credit-debit.schema").CreditDebitDocument> & import("./schemas/credit-debit.schema").CreditDebit & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    } | {
        status: number;
        message: string;
        data?: undefined;
    }>;
}
