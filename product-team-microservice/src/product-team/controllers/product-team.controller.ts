import { Controller, Post, Get, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductTeamService } from '../services/product-team.service';
import { GetPendingTeamMembersDto } from '../dto/get-pending-team-members.dto';
import { AddTeamMemberDto } from '../dto/add-team-member.dto';
import { GetTeamTreeDto } from '../dto/get-team-tree.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Product Team')
@ApiBearerAuth()
@Controller('product-team')
export class ProductTeamController {
  constructor(private readonly productTeamService: ProductTeamService) {}

  @Post('pending-members')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get pending team members' })
  @ApiResponse({ status: 200, description: 'Pending team members retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPendingTeamMembers(@Body() data: GetPendingTeamMembersDto, @Request() req) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.productTeamService.getPendingTeamMembers(data, userId);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Get('pending-level-details')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get pending level details' })
  @ApiResponse({ status: 200, description: 'Pending level details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPendingLevelDetails(@Request() req) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.productTeamService.getPendingLevelDetails(userId);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Post('add-team-member')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a new team member' })
  @ApiResponse({ status: 200, description: 'Team member added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addTeamMember(@Body() data: AddTeamMemberDto, @Request() req) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.productTeamService.addTeamMember(data, userId);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Get('team-tree')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get team tree details for current user' })
  @ApiResponse({ status: 200, description: 'Team tree details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTeamTreeDetails(@Request() req) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.productTeamService.getTeamTreeDetails(userId);
      return result;
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Get('team-tree/:registerId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get team tree details by register ID' })
  @ApiParam({ name: 'registerId', description: 'Register ID of the user' })
  @ApiQuery({ name: 'level', description: 'Level depth for team tree', required: false })
  @ApiResponse({ status: 200, description: 'Team tree details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTeamTreeDetailsByRegisterId(@Param('registerId') registerId: string, @Query('level') level?: number) {
    try {
      const result = await this.productTeamService.getTeamTreeDetailsByRegisterId(registerId, level);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Get('first-level/:registerId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get first level details by register ID' })
  @ApiParam({ name: 'registerId', description: 'Register ID of the user' })
  @ApiResponse({ status: 200, description: 'First level details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getFirstLevelDetails(@Param('registerId') registerId: string) {
    try {
      const result = await this.productTeamService.getFirstLevelDetails(registerId);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }

  @Get('network-count')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get network team count' })
  @ApiResponse({ status: 200, description: 'Network team count retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getNetworkTeamCount(@Request() req) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await this.productTeamService.getNetworkTeamCount(userId);
      return result;
    } catch (error) {
      console.log('error- ', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    }
  }
} 