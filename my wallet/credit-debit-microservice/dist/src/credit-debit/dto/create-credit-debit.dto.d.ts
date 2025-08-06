export declare class CreateCreditDebitDto {
    userId: string;
    reason: string;
    orderId?: string;
    status: 'Credited' | 'Debited';
    type: string;
    amount: number;
}
