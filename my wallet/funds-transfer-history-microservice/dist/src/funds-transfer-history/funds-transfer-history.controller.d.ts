import { FundsTransferHistoryService } from './funds-transfer-history.service';
declare class FundsTransferHistoryDto {
    userId: string;
    page: number;
    pagesize: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
    sort?: any;
}
declare class FundsTransferHistoryResponseDto {
    status: number;
    data?: any[];
    page?: number;
    pagesize?: number;
    total?: number;
    message?: string;
}
export declare class FundsTransferHistoryController {
    private readonly fundsTransferHistoryService;
    constructor(fundsTransferHistoryService: FundsTransferHistoryService);
    fundsTransferHistoryListing(data: FundsTransferHistoryDto): Promise<FundsTransferHistoryResponseDto>;
}
export {};
