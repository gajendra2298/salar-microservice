import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditDebitController } from './credit-debit/credit-debit.controller';
import { CreditDebitService } from './credit-debit/credit-debit.service';
import { CreditDebitSchema } from './credit-debit/schemas/credit-debit.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-debit'),
    MongooseModule.forFeature([
      { name: 'CreditDebit', schema: CreditDebitSchema },
    ]),
  ],
  controllers: [CreditDebitController],
  providers: [CreditDebitService],
})
export class AppModule {} 