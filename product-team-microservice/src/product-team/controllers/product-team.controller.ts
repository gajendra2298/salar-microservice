import { Controller, Post, Get, Body, Request, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductTeamService } from '../services/product-team.service';
import { GetPendingTeamMembersDto } from '../dto/get-pending-team-members.dto';
import { AddTeamMemberDto } from '../dto/add-team-member.dto';
import { GetTeamTreeDto } from '../dto/get-team-tree.dto';
import { GetPendingLevelDetailsDto } from '../dto/get-pending-level-details.dto';
import { GetNetworkCountDto } from '../dto/get-network-count.dto';

@ApiTags('Product Team')
@Controller('product-team')
export class ProductTeamController {
  constructor(private readonly productTeamService: ProductTeamService) {}

  @Post('pending-members')
  @ApiOperation({ summary: 'Get pending team members' })
  @ApiResponse({ status: 200, description: 'Pending team members retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPendingTeamMembers(@Body() data: GetPendingTeamMembersDto, @Request() req) {
    try {
      const userId = req.body?.userId || 'user123';
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

  @Post('pending-level-details')
  @ApiOperation({ summary: 'Get pending level details' })
  @ApiBody({ type: GetPendingLevelDetailsDto })
  @ApiResponse({ status: 200, description: 'Pending level details retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPendingLevelDetails(@Body() data: GetPendingLevelDetailsDto) {
    try {
      const userId = data.userId || 'user123';
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
  @ApiOperation({ summary: 'Add a new team member' })
  @ApiResponse({ status: 200, description: 'Team member added successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addTeamMember(@Body() data: AddTeamMemberDto, @Request() req) {
    try {
      const userId = req.body?.userId || 'user123';
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

  @Post('team-tree')
  @ApiOperation({ summary: 'Get team tree details for current user' })
  @ApiBody({ type: GetTeamTreeDto })
  @ApiResponse({ status: 200, description: 'Team tree details retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTeamTreeDetails(@Body() data: GetTeamTreeDto) {
    try {
      const userId = data.userId || 'user123';
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
  @ApiOperation({ summary: 'Get team tree details by register ID' })
  @ApiParam({ name: 'registerId', description: 'Register ID of the user' })
  @ApiQuery({ name: 'level', description: 'Level depth for team tree', required: false })
  @ApiResponse({ status: 200, description: 'Team tree details retrieved successfully' })
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
  @ApiOperation({ summary: 'Get first level details by register ID' })
  @ApiParam({ name: 'registerId', description: 'Register ID of the user' })
  @ApiResponse({ status: 200, description: 'First level details retrieved successfully' })
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

  @Post('network-count')
  @ApiOperation({ summary: 'Get network team count' })
  @ApiBody({ type: GetNetworkCountDto })
  @ApiResponse({ status: 200, description: 'Network team count retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getNetworkTeamCount(@Body() data: GetNetworkCountDto) {
    try {
      const userId = data.userId || 'user123';
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