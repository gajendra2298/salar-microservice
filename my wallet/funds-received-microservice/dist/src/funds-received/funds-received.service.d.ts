import { Model } from 'mongoose';
import { FundsDocument } from './schemas/funds.schema';
import { FundsReceivedResponseDto } from './dto/funds-received.dto';
export declare class FundsReceivedService {
    private fundsModel;
    constructor(fundsModel: Model<FundsDocument>);
    fundsReceivedHistoryListing(data: {
        userId: string;
        page: number;
        pagesize: number;
        startDate?: string;
        endDate?: string;
        searchText?: string;
        sort?: any;
    }): Promise<FundsReceivedResponseDto>;
}
