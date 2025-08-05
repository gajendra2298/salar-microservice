export declare enum CommissionType {
    REFERRAL_COMM = "Referral Comm",
    SPONSOR_COMM = "Sponsor Comm",
    AUS_COMM = "AuS Comm",
    PRODUCT_TEAM_REFERRAL_COMMISSION = "Product Team Referral Commission",
    NOVA_REFERRAL_COMMISSION = "Nova Referral Commission",
    ROYALTY_REFERRAL_TEAM_COMMISSION = "Royalty Referral Team Commission"
}
export declare const CommissionLabels: {
    "Referral Comm": string;
    "Sponsor Comm": string;
    "AuS Comm": string;
    "Product Team Referral Commission": string;
    "Nova Referral Commission": string;
    "Royalty Referral Team Commission": string;
};
export declare class TransferFormDto {
    customerRegisteredId: string;
    commissionType: CommissionType;
    amount: number;
    transactionPassword: string;
}
