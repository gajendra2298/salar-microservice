import { FundsTransferService } from './funds-transfer.service';
declare class TransferDataDto {
    userId: string;
    registerId: string;
    amount: number;
    type: string;
    transactionPassword: string;
}
export declare class FundsTransferController {
    private readonly fundsTransferService;
    constructor(fundsTransferService: FundsTransferService);
    getDropdownValuesForFunds(userId: string): Promise<{
        status: number;
        message: string;
        data: any;
    }>;
    fundTransfer(transferData: TransferDataDto): Promise<{
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
}
export {};
