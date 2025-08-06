import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SponsorTeamService } from '../services/sponsor-team.service';
import { AddSponsorTeamDto } from '../dto/add-sponsor-team.dto';
import { GetSponsorTeamDto } from '../dto/get-sponsor-team.dto';

@ApiTags('Sponsor Team')
@Controller('sponsor-team')
export class SponsorTeamController {
  constructor(private readonly sponsorTeamService: SponsorTeamService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add a new sponsor team member' })
  @ApiBody({ type: AddSponsorTeamDto })
  @ApiResponse({ status: 200, description: 'Sponsor team member added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - missing required fields' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addSponsorTeam(@Body() addSponsorTeamDto: AddSponsorTeamDto) {
    try {
      const fieldsArray = ['user_id', 'sponsor_id', 'doj', 'user_name'];
      const emptyFields = fieldsArray.filter(field => !addSponsorTeamDto[field]);
      
      if (emptyFields.length > 0) {
        return {
          status: 0,
          message: 'Please send ' + emptyFields.toString() + ' fields required.',
        };
      }

      const result = await this.sponsorTeamService.addSponsorTeam(addSponsorTeamDto);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal Server Error',
      };
    }
  }

  @Post('list')
  @ApiOperation({ summary: 'Get sponsor team list with filters and pagination' })
  @ApiBody({ type: GetSponsorTeamDto })
  @ApiResponse({ status: 200, description: 'Sponsor team list retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSponsorTeam(@Body() getSponsorTeamDto: GetSponsorTeamDto, @Request() req) {
    try {
      // Use sponsor_id from request body or default
      const userId = req.body?.sponsor_id || 'sponsor123';

      const result = await this.sponsorTeamService.getSponsorTeam(getSponsorTeamDto, userId);
      return result;
    } catch (error) {
      console.error('error-', error);
      return {
        status: 0,
        message: 'Internal Server Error',
      };
    }
  }
} 