import { IsString, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Address DTO for shipping addresses
export class AddressDto {
  @ApiProperty({
    description: 'Address name',
    example: 'Home Address',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main Street',
    required: false
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({
    description: 'Address line 2',
    example: 'Apt 4B',
    required: false
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
    required: false
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'City ID',
    example: '507f1f77bcf86cd799439011',
    required: false
  })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty({
    description: 'State ID',
    example: '507f1f77bcf86cd799439012',
    required: false
  })
  @IsOptional()
  @IsString()
  stateId?: string;

  @ApiProperty({
    description: 'District ID',
    example: '507f1f77bcf86cd799439013',
    required: false
  })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({
    description: 'ZIP code',
    example: 12345,
    required: false
  })
  @IsOptional()
  @IsNumber()
  zipCode?: number;

  @ApiProperty({
    description: 'Mobile number for this address',
    example: '+919876543210',
    required: false
  })
  @IsOptional()
  @IsString()
  mobileNo?: string;

  @ApiProperty({
    description: 'Email for this address',
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  emailId?: string;

  @ApiProperty({
    description: 'Country ID',
    example: '507f1f77bcf86cd799439014',
    required: false
  })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiProperty({
    description: 'Landmark',
    example: 'Near Central Park',
    required: false
  })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({
    description: 'Is this the default address?',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  defaultAddress?: boolean;
}

export class AddUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false
  })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiProperty({
    description: 'User profile image',
    example: 'profile.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female', 'other'],
    required: false
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    description: 'Country ID',
    example: '507f1f77bcf86cd799439011',
    required: false
  })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '+919876543210'
  })
  @IsString()
  @IsNotEmpty()
  mobileNo: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Transaction password',
    example: 'Transaction123!'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Transaction password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  transactionPassword: string;

  @ApiProperty({
    description: 'Sponsor ID',
    example: '507f1f77bcf86cd799439012',
    required: false
  })
  @IsOptional()
  @IsString()
  sponserId?: string;

  @ApiProperty({
    description: 'Upper level downline ID',
    example: '507f1f77bcf86cd799439013',
    required: false
  })
  @IsOptional()
  @IsString()
  ulDownlineId?: string;

  @ApiProperty({
    description: 'User level',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiProperty({
    description: 'Wallet balance',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  wallet?: number;

  @ApiProperty({
    description: 'Freezing amount',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  freezingAmount?: number;

  @ApiProperty({
    description: 'Salar coins',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  salarCoins?: number;

  @ApiProperty({
    description: 'Shopping amount',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  shoppingAmount?: number;

  @ApiProperty({
    description: 'Sponsor commission',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  sponserCommission?: number;

  @ApiProperty({
    description: 'AUR commission',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  aurCommission?: number;

  @ApiProperty({
    description: 'Game commission',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  gameCommission?: number;

  @ApiProperty({
    description: 'Funds',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  funds?: number;

  @ApiProperty({
    description: 'User role',
    example: 'regular',
    enum: ['regular', 'organisation']
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'Shipping addresses',
    type: [AddressDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  shippingAddresses?: AddressDto[];

  @ApiProperty({
    description: 'Organisation ID',
    example: '507f1f77bcf86cd799439013',
    required: false
  })
  @IsOptional()
  @IsString()
  organisationId?: string;

  @ApiProperty({
    description: 'Bank details ID',
    example: '507f1f77bcf86cd799439014',
    required: false
  })
  @IsOptional()
  @IsString()
  bankDetails?: string;

  @ApiProperty({
    description: 'KYC details ID',
    example: '507f1f77bcf86cd799439015',
    required: false
  })
  @IsOptional()
  @IsString()
  kycDetails?: string;

  @ApiProperty({
    description: 'State ID',
    example: '507f1f77bcf86cd799439016',
    required: false
  })
  @IsOptional()
  @IsString()
  stateId?: string;

  @ApiProperty({
    description: 'District ID',
    example: '507f1f77bcf86cd799439017',
    required: false
  })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
    required: false
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'ZIP code',
    example: '12345',
    required: false
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({
    description: 'User added by',
    example: '507f1f77bcf86cd799439018',
    required: false
  })
  @IsOptional()
  @IsString()
  userAddedBy?: string;

  @ApiProperty({
    description: 'Terms and conditions acceptance',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  termsAndConditions?: boolean;

  @ApiProperty({
    description: 'Is user deleted?',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({
    description: 'User status',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    description: 'Sales status',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  salesStatus?: boolean;

  @ApiProperty({
    description: 'Order processing status',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  orderProcessingStatus?: boolean;

  @ApiProperty({
    description: 'Preferred language',
    example: 'en',
    required: false
  })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;
} 