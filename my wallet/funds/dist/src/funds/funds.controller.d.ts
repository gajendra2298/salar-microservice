import { FundsService } from './funds.service';
import { FundTransferDto } from './dto/fund-transfer.dto';
import { FundHistoryDto } from './dto/fund-history.dto';
import { UserDetailsDto } from './dto/user-details.dto';
export declare class FundsController {
    private readonly fundsService;
    constructor(fundsService: FundsService);
    getDropdownValuesForFunds(userDetailsDto: UserDetailsDto): Promise<{
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
    fundTransfer(fundTransferDto: FundTransferDto): Promise<{
        status: number;
        message: string;
        data: {
            transactionNo: string;
            amount: number;
            receiverName: string;
            receiverRegisterId: string;
        };
    }>;
    fundsTransferHistoryListing(historyDto: FundHistoryDto): Promise<{
        status: number;
        data: any[];
        page: number;
        pagesize: number;
        total: number;
    }>;
    fundsReceivedHistoryListing(historyDto: FundHistoryDto): Promise<{
        status: number;
        data: any[];
        page: number;
        pagesize: number;
        total: number;
    }>;
    getTransactionDetails(transactionNo: string): Promise<{
        status: number;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/funds.schema").FundsDocument> & import("./schemas/funds.schema").Funds & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getAllFundRecords(userDetailsDto: UserDetailsDto): Promise<{
        status: number;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/funds.schema").FundsDocument> & import("./schemas/funds.schema").Funds & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
    }>;
    getFundStatistics(userDetailsDto: UserDetailsDto): Promise<{
        status: number;
        message: string;
        data: {
            sent: any;
            received: any;
            netAmount: number;
        };
    }>;
}
