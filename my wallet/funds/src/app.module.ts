import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FundsController } from './funds/funds.controller';
import { FundsService } from './funds/funds.service';
import { FundsSchema } from './funds/schemas/funds.schema';
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
      { name: 'Funds', schema: FundsSchema },
    ]),
  ],
  controllers: [FundsController],
  providers: [FundsService],
})
export class AppModule {} 