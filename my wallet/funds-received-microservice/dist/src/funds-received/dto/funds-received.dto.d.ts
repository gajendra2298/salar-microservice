export declare class FundsReceivedListingDto {
    userId: string;
    page: number;
    pagesize: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
    sort?: any;
}
export declare class FundsReceivedResponseDto {
    data: any[];
    total: number;
    page: number;
    pagesize: number;
    totalPages: number;
}
