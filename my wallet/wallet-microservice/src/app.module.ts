import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { WalletSchema } from './wallet/schemas/wallet.schema';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
        ...configService.get('database.options'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class AppModule {} 