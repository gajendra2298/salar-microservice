import { Test, TestingModule } from '@nestjs/testing';
import { ProductTeamController } from '../src/product-team/controllers/product-team.controller';
import { ProductTeamService } from '../src/product-team/services/product-team.service';

describe('ProductTeamController', () => {
  let controller: ProductTeamController;
  let service: ProductTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTeamController],
      providers: [
        {
          provide: ProductTeamService,
          useValue: {
            getPendingTeamMembers: jest.fn(),
            getPendingLevelDetails: jest.fn(),
            addTeamMember: jest.fn(),
            getTeamTreeDetails: jest.fn(),
            getTeamTreeDetailsByRegisterId: jest.fn(),
            getFirstLevelDetails: jest.fn(),
            getNetworkTeamCount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductTeamController>(ProductTeamController);
    service = module.get<ProductTeamService>(ProductTeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPendingTeamMembers', () => {
    it('should get pending team members successfully', async () => {
      const mockData = {
        searchText: 'test',
      };

      const mockResult = {
        status: 1,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            ulDownlineId: 'TEST001',
            registerId: 'PEND001',
            emailId: 'pending1@example.com',
            fullName: 'Pending User 1',
            organisationName: 'Test Org 1',
          },
        ],
      };

      jest.spyOn(service, 'getPendingTeamMembers').mockResolvedValue(mockResult);

      const result = await controller.getPendingTeamMembers(mockData, { user: { id: 'test-user-id' } });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getTeamTreeDetails', () => {
    it('should get team tree details successfully', async () => {
      const mockResult = {
        status: 1,
        data: [
          {
            level: 1,
            requiredMembers: 1,
            joinedMembers: 2,
            status: 'Pending',
            earnings: 0,
            users: [],
          },
        ],
      };

      jest.spyOn(service, 'getTeamTreeDetails').mockResolvedValue(mockResult);

      const result = await controller.getTeamTreeDetails({ user: { id: 'test-user-id' } });
      expect(result).toEqual(mockResult);
    });
  });

  describe('addTeamMember', () => {
    it('should add team member successfully', async () => {
      const mockData = {
        userId: '507f1f77bcf86cd799439011',
        teamMemberId: '507f1f77bcf86cd799439012',
      };

      const mockResult = {
        status: 1,
        message: 'User details updated successfully',
      };

      jest.spyOn(service, 'addTeamMember').mockResolvedValue(mockResult);

      const result = await controller.addTeamMember(mockData, { user: { id: 'test-user-id' } });
      expect(result).toEqual(mockResult);
    });
  });
}); 