import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SponsorTeamModule } from './sponsor-team/sponsor-team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/sponsor-team-microservice'),
    SponsorTeamModule,
  ],
})
export class AppModule {} 