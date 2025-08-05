import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsReceivedController } from './funds-received/funds-received.controller';
import { FundsReceivedService } from './funds-received/funds-received.service';
import { FundsSchema } from './funds-received/schemas/funds.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/funds-received'),
    MongooseModule.forFeature([
      { name: 'Funds', schema: FundsSchema },
    ]),
  ],
  controllers: [FundsReceivedController],
  providers: [FundsReceivedService],
})
export class AppModule {} 