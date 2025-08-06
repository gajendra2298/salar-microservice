import { WalletService } from './wallet.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { GetWalletBalanceDto } from './dto/get-wallet-balance.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWalletBalance(data: GetWalletBalanceDto): Promise<WalletResponseDto>;
    updateWalletBalance(updateWalletDto: UpdateWalletDto): Promise<WalletResponseDto>;
}
