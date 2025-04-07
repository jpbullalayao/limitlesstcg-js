import type { APIResponse, Player, PlayerListParams, PlayerStats, PlayerTournament, PlayerMatch } from '../types';
import { PaginatedResponse } from '../utils/pagination';

type PlayerResponse<T> = APIResponse<T>;

export class Players {
  constructor(private request: (path: string, options?: Record<string, unknown>) => Promise<PlayerResponse<Player | Player[] | PlayerStats | PlayerTournament[] | PlayerMatch[]>>) {}

  list(params: PlayerListParams = {}): PaginatedResponse<Player> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<Player[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<Player[]>;
    };

    const paginator = new PaginatedResponse<Player>(wrappedRequest, 20, '/players');
    paginator.setParams(params);
    return paginator;
  }

  async retrieve(id: string): Promise<Player> {
    const response = await this.request(`/players/${id}`);
    return response.data as Player;
  }

  async getStats(id: string): Promise<PlayerStats> {
    const response = await this.request(`/players/${id}/stats`);
    return response.data as PlayerStats;
  }

  getTournaments(id: string): PaginatedResponse<PlayerTournament> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<PlayerTournament[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<PlayerTournament[]>;
    };

    return new PaginatedResponse<PlayerTournament>(
      wrappedRequest,
      20,
      `/players/${id}/tournaments`
    );
  }

  getMatches(id: string): PaginatedResponse<PlayerMatch> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<PlayerMatch[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<PlayerMatch[]>;
    };

    return new PaginatedResponse<PlayerMatch>(
      wrappedRequest,
      20,
      `/players/${id}/matches`
    );
  }
} 