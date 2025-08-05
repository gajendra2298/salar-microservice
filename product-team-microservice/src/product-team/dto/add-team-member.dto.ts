import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'User ID of the person adding the team member',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User ID of the team member to be added',
    example: '507f1f77bcf86cd799439012'
  })
  @IsMongoId()
  @IsNotEmpty()
  teamMemberId: string;
} 