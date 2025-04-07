import { Tournaments } from '../resources/tournaments';
import { TournamentStatus, TournamentType } from '../types';

describe('Tournaments', () => {
  let tournaments: Tournaments;
  const mockRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    tournaments = new Tournaments(mockRequest);
  });

  describe('list', () => {
    const mockResponse = {
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
        hasMore: false,
      },
    };

    it('should return paginated tournaments', async () => {
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { data, meta } = await tournaments.list().firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/tournaments', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockResponse.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });

    it('should handle filtering parameters', async () => {
      mockRequest.mockResolvedValueOnce(mockResponse);

      await tournaments.list({ format: 'SV', status: 'ongoing' }).firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/tournaments', {
        params: { format: 'SV', status: 'ongoing', page: 1, pageSize: 20 },
      });
    });
  });

  describe('retrieve', () => {
    const mockTournament = {
      data: {
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
    };

    it('should retrieve a tournament by ID', async () => {
      mockRequest.mockResolvedValueOnce(mockTournament);

      const tournament = await tournaments.retrieve('tournament_1');

      expect(mockRequest).toHaveBeenCalledWith('/tournaments/tournament_1');
      expect(tournament).toEqual(mockTournament.data);
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

    const mockTournament = {
      data: {
        ...createParams,
        id: 'new_tournament',
      },
    };

    it('should create a new tournament', async () => {
      mockRequest.mockResolvedValueOnce(mockTournament);

      const tournament = await tournaments.create(createParams);

      expect(mockRequest).toHaveBeenCalledWith('/tournaments', {
        method: 'POST',
        body: createParams,
      });
      expect(tournament).toEqual(mockTournament.data);
    });
  });

  describe('update', () => {
    const updateParams = {
      name: 'Updated Tournament',
    };

    const mockTournament = {
      data: {
        id: 'tournament_1',
        ...updateParams,
      },
    };

    it('should update an existing tournament', async () => {
      mockRequest.mockResolvedValueOnce(mockTournament);

      const tournament = await tournaments.update('tournament_1', updateParams);

      expect(mockRequest).toHaveBeenCalledWith('/tournaments/tournament_1', {
        method: 'PATCH',
        body: updateParams,
      });
      expect(tournament).toEqual(mockTournament.data);
    });
  });

  describe('delete', () => {
    it('should delete a tournament', async () => {
      mockRequest.mockResolvedValueOnce(undefined);

      await tournaments.delete('tournament_1');

      expect(mockRequest).toHaveBeenCalledWith('/tournaments/tournament_1', {
        method: 'DELETE',
      });
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
      meta: {
        total: 1,
        page: 1,
        pageSize: 20,
        hasMore: false,
      },
    };

    it('should get tournament standings', async () => {
      mockRequest.mockResolvedValueOnce(mockStandings);

      const { data, meta } = await tournaments.getStandings('tournament_1').firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/tournaments/tournament_1/standings', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockStandings.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });
  });
}); 