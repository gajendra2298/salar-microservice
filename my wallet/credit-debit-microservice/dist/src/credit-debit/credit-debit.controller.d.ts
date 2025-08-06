import { CreditDebitService } from './credit-debit.service';
import { CreditDebitListingDto } from './dto/credit-debit-listing.dto';
import { CreateCreditDebitDto } from './dto/create-credit-debit.dto';
export declare class CreditDebitController {
    private readonly creditDebitService;
    constructor(creditDebitService: CreditDebitService);
    creditDebitListing(data: CreditDebitListingDto): Promise<{
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
    createCreditDebit(creditDebitData: CreateCreditDebitDto): Promise<{
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
