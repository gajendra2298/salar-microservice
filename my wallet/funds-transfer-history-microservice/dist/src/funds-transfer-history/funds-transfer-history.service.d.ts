import { Model } from 'mongoose';
import { FundsDocument } from './schemas/funds.schema';
export declare class FundsTransferHistoryService {
    private fundsModel;
    constructor(fundsModel: Model<FundsDocument>);
    fundsTransferHistoryListing(data: {
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
}
