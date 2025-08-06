import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Management (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/user/add (POST)', () => {
    it('should create a new user', () => {
      const addUserDto = {
        fullName: 'John Doe',
        emailId: 'john.doe@example.com',
        mobileNo: '+919876543210',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular',
        dob: '1990-01-01',
        gender: 'male',
        termsAndConditions: true,
        countryId: '507f1f77bcf86cd799439011',
        city: 'New York',
        zipCode: '12345',
        preferredLanguage: 'en',
        wallet: 0,
        funds: 0
      };

      return request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe(1);
          expect(res.body.message).toBe('User created successfully');
          expect(res.body.data).toBeDefined();
          expect(res.body.data.fullName).toBe(addUserDto.fullName);
          expect(res.body.data.emailId).toBe(addUserDto.emailId);
        });
    });

    it('should return 400 for invalid password format', () => {
      const addUserDto = {
        fullName: 'John Doe',
        emailId: 'john.doe@example.com',
        mobileNo: '+919876543210',
        password: 'weak',
        transactionPassword: 'Transaction123!',
        role: 'regular'
      };

      return request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(400);
    });
  });

  describe('/user/:id (GET)', () => {
    it('should get user by ID', async () => {
      // First create a user
      const addUserDto = {
        fullName: 'Jane Doe',
        emailId: 'jane.doe@example.com',
        mobileNo: '+919876543211',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular',
        countryId: '507f1f77bcf86cd799439011',
        city: 'Los Angeles',
        zipCode: '90210',
        preferredLanguage: 'en'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(201);

      const userId = createResponse.body.data.userId;

      // Then get the user by ID
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(1);
          expect(res.body.message).toBe('User found successfully');
          expect(res.body.data).toBeDefined();
          expect(res.body.data.fullName).toBe(addUserDto.fullName);
          expect(res.body.data.emailId).toBe(addUserDto.emailId);
          // Should not include sensitive data
          expect(res.body.data.password).toBeUndefined();
          expect(res.body.data.transactionPassword).toBeUndefined();
          expect(res.body.data.otp).toBeUndefined();
        });
    });

    it('should return 404 for non-existent user', () => {
      const fakeUserId = '507f1f77bcf86cd799439011';

      return request(app.getHttpServer())
        .get(`/user/${fakeUserId}`)
        .expect(404);
    });
  });

  describe('/user/:id (PUT)', () => {
    it('should update user by ID', async () => {
      // First create a user
      const addUserDto = {
        fullName: 'Test User',
        emailId: 'test.user@example.com',
        mobileNo: '+919876543212',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular',
        countryId: '507f1f77bcf86cd799439011',
        city: 'Test City',
        zipCode: '12345',
        preferredLanguage: 'en'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(201);

      const userId = createResponse.body.data.userId;

      // Then update the user
      const updateUserDto = {
        fullName: 'Updated Test User',
        city: 'Updated Test City',
        wallet: 100,
        funds: 200,
        preferredLanguage: 'es'
      };

      return request(app.getHttpServer())
        .put(`/user/${userId}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(1);
          expect(res.body.message).toBe('User updated successfully');
          expect(res.body.data).toBeDefined();
          expect(res.body.data.fullName).toBe(updateUserDto.fullName);
          expect(res.body.data.city).toBe(updateUserDto.city);
          expect(res.body.data.wallet).toBe(updateUserDto.wallet);
          expect(res.body.data.funds).toBe(updateUserDto.funds);
          expect(res.body.data.preferredLanguage).toBe(updateUserDto.preferredLanguage);
          // Should not include sensitive data
          expect(res.body.data.password).toBeUndefined();
          expect(res.body.data.transactionPassword).toBeUndefined();
          expect(res.body.data.otp).toBeUndefined();
        });
    });

    it('should update only provided fields', async () => {
      // First create a user
      const addUserDto = {
        fullName: 'Partial Update User',
        emailId: 'partial.update@example.com',
        mobileNo: '+919876543213',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular',
        wallet: 0,
        funds: 0
      };

      const createResponse = await request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(201);

      const userId = createResponse.body.data.userId;

      // Update only wallet
      const updateUserDto = {
        wallet: 500
      };

      return request(app.getHttpServer())
        .put(`/user/${userId}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(1);
          expect(res.body.message).toBe('User updated successfully');
          expect(res.body.data).toBeDefined();
          expect(res.body.data.wallet).toBe(500);
          // Other fields should remain unchanged
          expect(res.body.data.fullName).toBe(addUserDto.fullName);
          expect(res.body.data.funds).toBe(addUserDto.funds);
        });
    });

    it('should return 400 for invalid password format', async () => {
      // First create a user
      const addUserDto = {
        fullName: 'Password Test User',
        emailId: 'password.test@example.com',
        mobileNo: '+919876543214',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/user/add')
        .send(addUserDto)
        .expect(201);

      const userId = createResponse.body.data.userId;

      // Try to update with invalid password
      const updateUserDto = {
        password: 'weak'
      };

      return request(app.getHttpServer())
        .put(`/user/${userId}`)
        .send(updateUserDto)
        .expect(400);
    });

    it('should return 404 for non-existent user', () => {
      const fakeUserId = '507f1f77bcf86cd799439011';
      const updateUserDto = {
        fullName: 'Updated Name'
      };

      return request(app.getHttpServer())
        .put(`/user/${fakeUserId}`)
        .send(updateUserDto)
        .expect(404);
    });

    it('should return 409 for duplicate email', async () => {
      // Create first user
      const user1Dto = {
        fullName: 'User One',
        emailId: 'user1@example.com',
        mobileNo: '+919876543215',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular'
      };

      const createResponse1 = await request(app.getHttpServer())
        .post('/user/add')
        .send(user1Dto)
        .expect(201);

      // Create second user
      const user2Dto = {
        fullName: 'User Two',
        emailId: 'user2@example.com',
        mobileNo: '+919876543216',
        password: 'Password123!',
        transactionPassword: 'Transaction123!',
        role: 'regular'
      };

      const createResponse2 = await request(app.getHttpServer())
        .post('/user/add')
        .send(user2Dto)
        .expect(201);

      const userId2 = createResponse2.body.data.userId;

      // Try to update second user with first user's email
      const updateUserDto = {
        emailId: 'user1@example.com'
      };

      return request(app.getHttpServer())
        .put(`/user/${userId2}`)
        .send(updateUserDto)
        .expect(409);
    });
  });
}); 