import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsTransferHistoryController } from './funds-transfer-history/funds-transfer-history.controller';
import { FundsTransferHistoryService } from './funds-transfer-history/funds-transfer-history.service';
import { FundsSchema } from './funds-transfer-history/schemas/funds.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/funds-transfer-history',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Funds', schema: FundsSchema },
    ]),
  ],
  controllers: [FundsTransferHistoryController],
  providers: [FundsTransferHistoryService],
})
export class AppModule {} 