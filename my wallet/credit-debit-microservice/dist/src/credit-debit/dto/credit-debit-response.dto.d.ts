export declare class CreditDebitTransactionDto {
    createdAt: Date;
    transactionNo: string;
    status: string;
    type: string;
    amount: number;
    reason: string;
    orderId?: string;
}
export declare class CreditDebitListingResponseDto {
    status: number;
    data: CreditDebitTransactionDto[];
    page: number;
    pagesize: number;
    total: number;
}
export declare class CreateCreditDebitResponseDto {
    status: number;
    message: string;
    data: CreditDebitTransactionDto;
}
