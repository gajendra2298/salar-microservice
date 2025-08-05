import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSponsorTeamDto {
  @ApiProperty({ 
    description: 'User ID (MongoDB ObjectId)', 
    example: '507f1f77bcf86cd799439011' 
  })
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ 
    description: 'Sponsor ID', 
    example: 'sponsor123' 
  })
  @IsString()
  @IsNotEmpty()
  sponsor_id: string;

  @ApiProperty({ 
    description: 'Date of joining', 
    example: '2024-01-15' 
  })
  @IsString()
  @IsNotEmpty()
  doj: string;

  @ApiProperty({ 
    description: 'User name', 
    example: 'John Doe' 
  })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ 
    description: 'Email ID (optional)', 
    example: 'john.doe@example.com',
    required: false 
  })
  @IsString()
  @IsOptional()
  email_id?: string;

  @ApiProperty({ 
    description: 'Registration ID (optional)', 
    example: 'REG123456',
    required: false 
  })
  @IsString()
  @IsOptional()
  registerId?: string;

  @ApiProperty({ 
    description: 'Sponsor name (optional)', 
    example: 'ABC Corporation',
    required: false 
  })
  @IsString()
  @IsOptional()
  sponsor_name?: string;
} 