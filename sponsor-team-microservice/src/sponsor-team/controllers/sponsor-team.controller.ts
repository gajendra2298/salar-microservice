import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SponsorTeamService } from '../services/sponsor-team.service';
import { AddSponsorTeamDto } from '../dto/add-sponsor-team.dto';
import { GetSponsorTeamDto } from '../dto/get-sponsor-team.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Sponsor Team')
@Controller('sponsor-team')
export class SponsorTeamController {
  constructor(private readonly sponsorTeamService: SponsorTeamService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new sponsor team member' })
  @ApiBody({ type: AddSponsorTeamDto })
  @ApiResponse({ status: 200, description: 'Sponsor team member added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - missing required fields' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sponsor team list with filters and pagination' })
  @ApiBody({ type: GetSponsorTeamDto })
  @ApiResponse({ status: 200, description: 'Sponsor team list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSponsorTeam(@Body() getSponsorTeamDto: GetSponsorTeamDto, @Request() req) {
    try {
      // Get user from JWT token
      const userId = req.user?.id || req.user?.registerId;
      
      if (!userId) {
        return {
          status: 0,
          message: 'Invalid user or user registration ID.',
        };
      }

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