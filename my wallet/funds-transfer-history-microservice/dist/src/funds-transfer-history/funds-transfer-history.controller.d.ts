import { FundsTransferHistoryService, TransferHistoryData } from './funds-transfer-history.service';
export declare class FundsTransferHistoryController {
    private readonly fundsTransferHistoryService;
    constructor(fundsTransferHistoryService: FundsTransferHistoryService);
    saveTransferHistory(transferData: TransferHistoryData): Promise<any>;
    getTransferHistory(userId?: string, page?: number, limit?: number): Promise<any>;
}
