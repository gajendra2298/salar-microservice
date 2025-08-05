import { WalletService } from './wallet.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWalletBalance(userId: string): Promise<WalletResponseDto>;
    updateWalletBalance(updateWalletDto: UpdateWalletDto): Promise<WalletResponseDto>;
}
