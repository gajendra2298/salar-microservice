import { Test, TestingModule } from '@nestjs/testing';
import { SponsorTeamController } from '../src/sponsor-team/controllers/sponsor-team.controller';
import { SponsorTeamService } from '../src/sponsor-team/services/sponsor-team.service';

describe('SponsorTeamController', () => {
  let controller: SponsorTeamController;
  let service: SponsorTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsorTeamController],
      providers: [
        {
          provide: SponsorTeamService,
          useValue: {
            addSponsorTeam: jest.fn(),
            getSponsorTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SponsorTeamController>(SponsorTeamController);
    service = module.get<SponsorTeamService>(SponsorTeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addSponsorTeam', () => {
    it('should add a sponsor team member successfully', async () => {
      const mockData = {
        user_id: '507f1f77bcf86cd799439011',
        sponsor_id: 'SP001',
        doj: '2024-01-01',
        user_name: 'John Doe',
      };

      const mockResult = {
        status: 1,
        message: 'Sponsor team member added successfully',
        data: mockData,
      };

      jest.spyOn(service, 'addSponsorTeam').mockResolvedValue(mockResult);

      const result = await controller.addSponsorTeam(mockData);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSponsorTeam', () => {
    it('should get sponsor team list successfully', async () => {
      const mockData = {
        currentPage: 1,
        itemsPerPage: 10,
      };

      const mockResult = {
        status: 1,
        data: [],
        count: 0,
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 0,
        },
      };

      jest.spyOn(service, 'getSponsorTeam').mockResolvedValue(mockResult);

      const result = await controller.getSponsorTeam(mockData, { user: { id: 'test-user-id' } });
      expect(result).toEqual(mockResult);
    });
  });
}); 