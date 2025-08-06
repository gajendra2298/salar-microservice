import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AddUserDto } from '../dto/add-user.dto';

@ApiTags('User Management')
@Controller('user')
export class AddUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ 
    summary: 'Add new user',
    description: 'Create a new user with all required information'
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 409, description: 'User already exists with this email' })
  @Post('add')
  async addUser(@Body() addUserDto: AddUserDto) {
    return this.userService.addUser(addUserDto);
  }
} 