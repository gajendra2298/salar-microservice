import { FundsReceivedService } from './funds-received.service';
import { FundsReceivedListingDto, FundsReceivedResponseDto } from './dto/funds-received.dto';
export declare class FundsReceivedController {
    private readonly fundsReceivedService;
    constructor(fundsReceivedService: FundsReceivedService);
    fundsReceivedHistoryListing(data: FundsReceivedListingDto): Promise<FundsReceivedResponseDto>;
}
