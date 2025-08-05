import { FundsTransferService } from './funds-transfer.service';
import { TransferFormDto } from './dto/transfer-form.dto';
export declare class FundsTransferController {
    private readonly fundsTransferService;
    constructor(fundsTransferService: FundsTransferService);
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
    fundTransfer(transferData: any): Promise<{
        status: number;
        message: any;
    }>;
    fundsTransferHistoryListing(listingData: any): Promise<{
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
    fundsReceivedHistoryListing(listingData: any): Promise<{
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
    transferFunds(transferFormData?: TransferFormDto): Promise<{
        status: number;
        message: any;
    } | {
        success: boolean;
        message: string;
        data: {
            commissionTypes: {
                value: string;
                label: string;
                description: string;
            }[];
            formFields: {
                customerRegisteredId: string;
                commissionType: string;
                amount: number;
                transactionPassword: string;
            };
        };
    }>;
}
