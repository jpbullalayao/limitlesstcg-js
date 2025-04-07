import { Players } from '../resources/players';

describe('Players', () => {
  let players: Players;
  const mockRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    players = new Players(mockRequest);
  });

  describe('list', () => {
    const mockResponse = {
      data: [
        {
          id: 'player_1',
          name: 'Test Player',
          country: 'US',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        pageSize: 20,
        hasMore: false,
      },
    };

    it('should return paginated players', async () => {
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { data, meta } = await players.list().firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/players', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockResponse.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });

    it('should handle filtering parameters', async () => {
      mockRequest.mockResolvedValueOnce(mockResponse);

      await players.list({ country: 'US' }).firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/players', {
        params: { country: 'US', page: 1, pageSize: 20 },
      });
    });
  });

  describe('retrieve', () => {
    const mockPlayer = {
      data: {
        id: 'player_1',
        name: 'Test Player',
        country: 'US',
      },
    };

    it('should retrieve a player by ID', async () => {
      mockRequest.mockResolvedValueOnce(mockPlayer);

      const player = await players.retrieve('player_1');

      expect(mockRequest).toHaveBeenCalledWith('/players/player_1');
      expect(player).toEqual(mockPlayer.data);
    });
  });

  describe('getStats', () => {
    const mockStats = {
      data: {
        totalTournaments: 10,
        totalMatches: 50,
        wins: 35,
        losses: 15,
        winRate: 0.7,
      },
    };

    it('should get player stats', async () => {
      mockRequest.mockResolvedValueOnce(mockStats);

      const stats = await players.getStats('player_1');

      expect(mockRequest).toHaveBeenCalledWith('/players/player_1/stats');
      expect(stats).toEqual(mockStats.data);
    });
  });

  describe('getTournaments', () => {
    const mockTournaments = {
      data: [
        {
          id: 'tournament_1',
          name: 'Test Tournament',
          rank: 1,
          points: 30,
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

    it('should get player tournaments', async () => {
      mockRequest.mockResolvedValueOnce(mockTournaments);

      const { data, meta } = await players.getTournaments('player_1').firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/players/player_1/tournaments', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockTournaments.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });
  });

  describe('getMatches', () => {
    const mockMatches = {
      data: [
        {
          id: 'match_1',
          tournamentId: 'tournament_1',
          tournamentName: 'Test Tournament',
          opponentId: 'opponent_1',
          opponentName: 'Test Opponent',
          result: 'win',
          round: 1,
        },
      ],
      meta: {
        total: 1,
        page: 1,
        pageSize: 20,
        hasMore: false,
      },
    };

    it('should get player matches', async () => {
      mockRequest.mockResolvedValueOnce(mockMatches);

      const { data, meta } = await players.getMatches('player_1').firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/players/player_1/matches', {
        params: { page: 1, pageSize: 20 },
      });
      expect(data).toEqual(mockMatches.data);
      expect(meta.total).toBe(1);
      expect(meta.hasMore).toBe(false);
    });
  });
}); 