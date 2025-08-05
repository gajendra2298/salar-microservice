import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SponsorTeamController } from './controllers/sponsor-team.controller';
import { SponsorTeamService } from './services/sponsor-team.service';
import { SponsorTeam, SponsorTeamSchema } from './schemas/sponsor-team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SponsorTeam.name, schema: SponsorTeamSchema },
    ]),
  ],
  controllers: [SponsorTeamController],
  providers: [SponsorTeamService],
  exports: [SponsorTeamService],
})
export class SponsorTeamModule {} 