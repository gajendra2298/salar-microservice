import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ProductTeamModule } from '../src/product-team/product-team.module';
import { 
  addTeamMemberTestData, 
  getPendingTeamMembersTestData, 
  getTeamTreeTestData,
  mockResponseData,
  testJwtTokens,
  testRegisterIds,
  testLevels,
  swaggerTestScenarios
} from './swagger-test-data';

describe('Product Team - Swagger Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductTeamModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /product-team/add-team-member', () => {
    it('should successfully add a team member with valid data', async () => {
      const testData = addTeamMemberTestData.valid;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.status).toBe(1);
    });

    it('should return validation error for invalid MongoDB ObjectId', async () => {
      const testData = addTeamMemberTestData.invalid;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });

    it('should return unauthorized error without JWT token', async () => {
      const testData = addTeamMemberTestData.valid;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .send(testData)
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });

    it('should return validation error for missing required fields', async () => {
      const testData = addTeamMemberTestData.missingFields;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });
  });

  describe('POST /product-team/pending-members', () => {
    it('should get pending team members with search text', async () => {
      const testData = getPendingTeamMembersTestData.withSearch;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/pending-members')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get all pending team members without search text', async () => {
      const testData = getPendingTeamMembersTestData.withoutSearch;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/pending-members')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
    });

    it('should handle special characters in search text', async () => {
      const testData = getPendingTeamMembersTestData.specialCharacters;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/pending-members')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .send(testData)
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /product-team/pending-level-details', () => {
    it('should get pending level details successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/pending-level-details')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return unauthorized error without JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/pending-level-details')
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });
  });

  describe('GET /product-team/team-tree', () => {
    it('should get team tree details for current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/team-tree')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
    });

    it('should return unauthorized error without JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/team-tree')
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });
  });

  describe('GET /product-team/team-tree/:registerId', () => {
    it('should get team tree details by valid register ID', async () => {
      const registerId = testRegisterIds.valid;
      
      const response = await request(app.getHttpServer())
        .get(`/product-team/team-tree/${registerId}`)
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
    });

    it('should get team tree details with level parameter', async () => {
      const registerId = testRegisterIds.valid;
      const level = testLevels.valid[0];
      
      const response = await request(app.getHttpServer())
        .get(`/product-team/team-tree/${registerId}?level=${level}`)
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
    });

    it('should handle invalid register ID gracefully', async () => {
      const registerId = testRegisterIds.invalid;
      
      const response = await request(app.getHttpServer())
        .get(`/product-team/team-tree/${registerId}`)
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /product-team/first-level/:registerId', () => {
    it('should get first level details by valid register ID', async () => {
      const registerId = testRegisterIds.valid;
      
      const response = await request(app.getHttpServer())
        .get(`/product-team/first-level/${registerId}`)
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
    });

    it('should handle invalid register ID gracefully', async () => {
      const registerId = testRegisterIds.invalid;
      
      const response = await request(app.getHttpServer())
        .get(`/product-team/first-level/${registerId}`)
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /product-team/network-count', () => {
    it('should get network team count successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/network-count')
        .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalMembers');
      expect(response.body.data).toHaveProperty('activeMembers');
      expect(response.body.data).toHaveProperty('pendingMembers');
    });

    it('should return unauthorized error without JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/product-team/network-count')
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });
  });

  describe('Authentication Tests', () => {
    it('should reject expired JWT token', async () => {
      const testData = addTeamMemberTestData.valid;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .set('Authorization', `Bearer ${testJwtTokens.expiredToken}`)
        .send(testData)
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });

    it('should reject invalid JWT token format', async () => {
      const testData = addTeamMemberTestData.valid;
      
      const response = await request(app.getHttpServer())
        .post('/product-team/add-team-member')
        .set('Authorization', `Bearer ${testJwtTokens.invalidToken}`)
        .send(testData)
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(0);
    });
  });

  describe('Swagger Test Scenarios', () => {
    describe('Add Team Member Scenarios', () => {
      it('should handle success scenario', async () => {
        const scenario = swaggerTestScenarios.addTeamMember.success;
        
        const response = await request(app.getHttpServer())
          .post('/product-team/add-team-member')
          .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
          .send(scenario.requestBody)
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe(1);
      });

      it('should handle validation error scenario', async () => {
        const scenario = swaggerTestScenarios.addTeamMember.validationError;
        
        const response = await request(app.getHttpServer())
          .post('/product-team/add-team-member')
          .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
          .send(scenario.requestBody)
          .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe(0);
      });
    });

    describe('Get Pending Team Members Scenarios', () => {
      it('should handle search scenario', async () => {
        const scenario = swaggerTestScenarios.getPendingTeamMembers.withSearch;
        
        const response = await request(app.getHttpServer())
          .post('/product-team/pending-members')
          .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
          .send(scenario.requestBody)
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
      });

      it('should handle empty request scenario', async () => {
        const scenario = swaggerTestScenarios.getPendingTeamMembers.withoutSearch;
        
        const response = await request(app.getHttpServer())
          .post('/product-team/pending-members')
          .set('Authorization', `Bearer ${testJwtTokens.validToken}`)
          .send(scenario.requestBody)
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
      });
    });
  });
}); 