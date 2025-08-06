import { FundType } from '../schemas/funds.schema';
export declare class FundTransferDto {
    userId: string;
    registerId: string;
    amount: number;
    type: FundType;
    transactionPassword: string;
}
