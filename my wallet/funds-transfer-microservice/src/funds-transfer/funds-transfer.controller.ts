import { Controller, Post, Get, Body, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FundsTransferService } from './funds-transfer.service';
import { TransferFormDto, CommissionType, CommissionLabels } from './dto/transfer-form.dto';

@ApiTags('funds-transfer')
@Controller('funds-transfer')
export class FundsTransferController {
  constructor(private readonly fundsTransferService: FundsTransferService) {}

  @Get('dropdown-values')
  @ApiOperation({
    summary: 'Get dropdown values for funds',
    description: 'Get user commission details for dropdown display'
  })
  @ApiResponse({
    status: 200,
    description: 'Dropdown values retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 1 },
        message: { type: 'string', example: 'User details are: ' },
        data: {
          type: 'object',
          properties: {
            sponserCommission: { type: 'number', example: 1500.00 },
            aurCommission: { type: 'number', example: 800.00 },
            gameCommission: { type: 'number', example: 1200.00 },
            funds: { type: 'number', example: 5000.00 }
          }
        }
      }
    }
  })
  async getDropdownValuesForFunds() {
    return await this.fundsTransferService.getDropdownValuesForFunds();
  }

  @Post('transfer')
  @ApiOperation({
    summary: 'Fund transfer',
    description: 'Transfer funds between users with commission validation'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        registerId: { type: 'string', example: 'CUST123456', description: 'Receiver register ID' },
        amount: { type: 'number', example: 100.00, description: 'Transfer amount' },
        type: { 
          type: 'string', 
          enum: ['Sponser Commission', 'Aur Commission', 'Game Commission', 'PRT Commission'],
          example: 'Sponser Commission',
          description: 'Commission type to transfer from'
        },
        transactionPassword: { type: 'string', example: 'password123', description: 'Transaction password' }
      },
      required: ['registerId', 'amount', 'type', 'transactionPassword']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Funds transferred successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 1 },
        message: { type: 'string', example: 'Funds sent successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid transaction password'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async fundTransfer(@Body() transferData: any) {
    return await this.fundsTransferService.fundTransfer(transferData);
  }

  @Post('transfer-history')
  @ApiOperation({
    summary: 'Funds transfer history listing',
    description: 'Get paginated list of funds transfer history'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1, description: 'Page number' },
        pagesize: { type: 'number', example: 10, description: 'Records per page' },
        startDate: { type: 'string', example: '2022-09-20', description: 'Start date filter' },
        endDate: { type: 'string', example: '2024-10-25', description: 'End date filter' },
        searchText: { type: 'string', example: '', description: 'Search text' },
        sort: { type: 'object', description: 'Sort criteria' }
      },
      required: ['page', 'pagesize']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Transfer history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 1 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              transactionNo: { type: 'string', example: 'FABC123456789' },
              commissionName: { type: 'string', example: 'Sponser Commission' },
              amount: { type: 'number', example: 100.00 },
              receiver: {
                type: 'object',
                properties: {
                  _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  fullName: { type: 'string', example: 'John Doe' },
                  registerId: { type: 'string', example: 'CUST123456' }
                }
              },
              status: { type: 'string', example: 'Success' }
            }
          }
        },
        page: { type: 'number', example: 1 },
        pagesize: { type: 'number', example: 10 },
        total: { type: 'number', example: 50 }
      }
    }
  })
  async fundsTransferHistoryListing(@Body() listingData: any) {
    return await this.fundsTransferService.fundsTransferHistoryListing(listingData);
  }

  @Post('received-history')
  @ApiOperation({
    summary: 'Funds received history listing',
    description: 'Get paginated list of funds received history'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1, description: 'Page number' },
        pagesize: { type: 'number', example: 10, description: 'Records per page' },
        startDate: { type: 'string', example: '2022-09-20', description: 'Start date filter' },
        endDate: { type: 'string', example: '2024-10-25', description: 'End date filter' },
        searchText: { type: 'string', example: '', description: 'Search text' },
        sort: { type: 'object', description: 'Sort criteria' }
      },
      required: ['page', 'pagesize']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Received history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 1 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              transactionNo: { type: 'string', example: 'FABC123456789' },
              commissionName: { type: 'string', example: 'Sponser Commission' },
              amount: { type: 'number', example: 100.00 },
              sender: {
                type: 'object',
                properties: {
                  _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  fullName: { type: 'string', example: 'John Doe' },
                  registerId: { type: 'string', example: 'CUST123456' },
                  imageUrl: { type: 'string', example: 'https://example.com/image.jpg' }
                }
              },
              status: { type: 'string', example: 'Success' }
            }
          }
        },
        page: { type: 'number', example: 1 },
        pagesize: { type: 'number', example: 10 },
        total: { type: 'number', example: 50 }
      }
    }
  })
  async fundsReceivedHistoryListing(@Body() listingData: any) {
    return await this.fundsTransferService.fundsReceivedHistoryListing(listingData);
  }

  @Post('transfer-funds')
  @ApiOperation({
    summary: 'Transfer funds with commission validation and dropdown data',
    description: 'Complete funds transfer process with form validation. This endpoint automatically provides all available commission types for dropdown selection and processes the transfer. Supports both JSON and form data requests.'
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({
    type: TransferFormDto,
    description: 'Funds transfer form data with commission type selection (supports both JSON and form data)',
    examples: {
      json: {
        summary: 'JSON Request',
        value: {
          customerRegisteredId: 'CUST123456',
          commissionType: CommissionType.REFERRAL_COMM,
          amount: 1000.00,
          transactionPassword: 'password123'
        }
      },
      form: {
        summary: 'Form Data Request',
        value: {
          customerRegisteredId: 'CUST123456',
          commissionType: CommissionType.REFERRAL_COMM,
          amount: 1000.00,
          transactionPassword: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Commission types and transfer form data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Commission types and form data retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            commissionTypes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: { type: 'string', example: 'Referral Comm' },
                  label: { type: 'string', example: 'Referral Commission' },
                  description: { type: 'string', example: 'Transfer from Referral Commission' }
                }
              }
            },
            formFields: {
              type: 'object',
              properties: {
                customerRegisteredId: { type: 'string', example: '' },
                commissionType: { type: 'string', example: '' },
                amount: { type: 'number', example: 0 },
                transactionPassword: { type: 'string', example: '' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Funds transferred successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Funds transferred successfully' },
        data: {
          type: 'object',
          properties: {
            transactionNo: { type: 'string', example: 'TXN20241201001' },
            senderId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            receiverId: { type: 'string', example: 'CUST123456' },
            commissionType: { type: 'string', example: 'Referral Comm' },
            amount: { type: 'number', example: 1000.00 },
            adminCharges: { type: 'number', example: 50.00 },
            netPayable: { type: 'number', example: 950.00 },
            status: { type: 'string', example: 'Success' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or insufficient balance'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid transaction password'
  })
  @ApiResponse({
    status: 404,
    description: 'Customer or wallet not found'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  @UseInterceptors(FileInterceptor('file'))
  async transferFunds(@Body() transferFormData?: TransferFormDto) {
    try {
      // If no form data provided, return commission types for dropdown
      if (!transferFormData || Object.keys(transferFormData).length === 0) {
        const commissionTypes = Object.entries(CommissionLabels).map(([value, label]) => ({
          value,
          label,
          description: `Transfer from ${label}`
        }));

        return {
          success: true,
          message: 'Commission types and form data retrieved successfully',
          data: {
            commissionTypes,
            formFields: {
              customerRegisteredId: '',
              commissionType: '',
              amount: 0,
              transactionPassword: ''
            }
          }
        };
      }

      // Convert TransferFormDto to the expected format for fundTransfer
      const transferData = {
        registerId: transferFormData.customerRegisteredId,
        amount: transferFormData.amount,
        type: transferFormData.commissionType,
        transactionPassword: transferFormData.transactionPassword
      };

      // Process the actual transfer
      return await this.fundsTransferService.fundTransfer(transferData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during fund transfer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 