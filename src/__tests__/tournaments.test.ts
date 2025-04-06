import axios from 'axios';
import { Tournaments } from '../resources/tournaments';
import { TournamentStatus, TournamentType } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Tournaments', () => {
  let tournaments: Tournaments;
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tournaments = new Tournaments(mockAxiosInstance as any);
  });

  describe('list', () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: 'tournament_1',
            name: 'Test Tournament 1',
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            format: 'SV',
            status: TournamentStatus.ONGOING,
            playerCount: 64,
            roundCount: 6,
            type: TournamentType.SWISS,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          pageSize: 20,
        },
      },
    };

    it('should return paginated tournaments', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const { data, meta } = await tournaments.list().firstPage();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tournaments', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockResponse.data.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });

    it('should handle filtering parameters', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      await tournaments.list({ format: 'SV', status: 'ongoing' }).firstPage();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tournaments', {
        params: { format: 'SV', status: 'ongoing', page: 1, pageSize: 20 },
      });
    });
  });

  describe('retrieve', () => {
    const mockTournament = {
      id: 'tournament_1',
      name: 'Test Tournament 1',
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      format: 'SV',
      status: TournamentStatus.ONGOING,
      playerCount: 64,
      roundCount: 6,
      type: TournamentType.SWISS,
    };

    it('should retrieve a tournament by ID', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockTournament });

      const tournament = await tournaments.retrieve('tournament_1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tournaments/tournament_1');
      expect(tournament).toEqual(mockTournament);
    });
  });

  describe('create', () => {
    const createParams = {
      name: 'New Tournament',
      format: 'SV',
      startDate: '2024-02-01',
      endDate: '2024-02-02',
      type: 'swiss',
    };

    it('should create a new tournament', async () => {
      const mockTournament = { ...createParams, id: 'new_tournament' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockTournament });

      const tournament = await tournaments.create(createParams);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tournaments', createParams);
      expect(tournament).toEqual(mockTournament);
    });
  });

  describe('update', () => {
    const updateParams = {
      name: 'Updated Tournament',
    };

    it('should update an existing tournament', async () => {
      const mockTournament = { id: 'tournament_1', ...updateParams };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: mockTournament });

      const tournament = await tournaments.update('tournament_1', updateParams);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/tournaments/tournament_1', updateParams);
      expect(tournament).toEqual(mockTournament);
    });
  });

  describe('delete', () => {
    it('should delete a tournament', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({});

      await tournaments.delete('tournament_1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tournaments/tournament_1');
    });
  });

  describe('getStandings', () => {
    const mockStandings = {
      data: [
        {
          rank: 1,
          playerId: 'player_1',
          playerName: 'Test Player',
          points: 18,
          wins: 6,
          losses: 0,
          draws: 0,
        },
      ],
    };

    it('should get tournament standings', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockStandings });

      const standings = await tournaments.getStandings('tournament_1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tournaments/tournament_1/standings');
      expect(standings).toEqual(mockStandings);
    });
  });
}); 