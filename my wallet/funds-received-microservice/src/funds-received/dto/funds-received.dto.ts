import { ApiProperty } from '@nestjs/swagger';

export class FundsReceivedListingDto {
  @ApiProperty({
    description: 'User ID for filtering funds received',
    example: '507f1f77bcf86cd799439011'
  })
  userId: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  pagesize: number;

  @ApiProperty({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
    required: false
  })
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
    required: false
  })
  endDate?: string;

  @ApiProperty({
    description: 'Search text for filtering results',
    example: 'payment',
    required: false
  })
  searchText?: string;

  @ApiProperty({
    description: 'Sorting options',
    example: { field: 'createdAt', order: 'desc' },
    required: false
  })
  sort?: any;
}

export class FundsReceivedResponseDto {
  @ApiProperty({
    description: 'List of funds received records',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  data: any[];

  @ApiProperty({
    description: 'Total number of records',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  pagesize: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10
  })
  totalPages: number;
} 