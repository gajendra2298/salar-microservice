import { FundType, FundStatus } from '../schemas/funds.schema';
export declare class FundResponseDto {
    _id: string;
    userId: string;
    receiverUserId: string;
    type: FundType;
    amount: number;
    transactionNo: string;
    status: FundStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FundHistoryResponseDto {
    createdAt: Date;
    transactionNo: string;
    commissionName: FundType;
    amount: number;
    status: FundStatus;
    receiver?: {
        _id: string;
        fullName: string;
        registerId: string;
    };
    sender?: {
        _id: string;
        fullName: string;
        registerId: string;
        imageUrl?: string;
    };
}
export declare class FundHistoryListResponseDto {
    status: number;
    data: FundHistoryResponseDto[];
    page: number;
    pagesize: number;
    total: number;
}
export declare class FundTransferResponseDto {
    status: number;
    message: string;
    data?: any;
}
export declare class UserDetailsResponseDto {
    status: number;
    message: string;
    data?: {
        sponserCommission: number;
        aurCommission: number;
        gameCommission: number;
        funds: number;
    };
}
