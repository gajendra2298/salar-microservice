import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsTransferController } from './funds-transfer/funds-transfer.controller';
import { FundsTransferService } from './funds-transfer/funds-transfer.service';
import { FundsSchema } from './funds-transfer/schemas/funds.schema';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(appConfig.mongodb.uri),
    MongooseModule.forFeature([
      { name: 'Funds', schema: FundsSchema },
    ]),
  ],
  controllers: [FundsTransferController],
  providers: [FundsTransferService],
})
export class AppModule {} 