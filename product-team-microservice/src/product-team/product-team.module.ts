import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductTeamController } from './controllers/product-team.controller';
import { ProductTeamService } from './services/product-team.service';
import { TeamLevels, TeamLevelsSchema } from './schemas/team-levels.schema';
import { TeamMember, TeamMemberSchema } from './schemas/team-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamLevels.name, schema: TeamLevelsSchema },
      { name: TeamMember.name, schema: TeamMemberSchema },
    ]),
  ],
  controllers: [ProductTeamController],
  providers: [ProductTeamService],
  exports: [ProductTeamService],
})
export class ProductTeamModule {} 