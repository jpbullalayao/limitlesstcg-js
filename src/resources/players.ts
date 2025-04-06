import type { AxiosInstance } from 'axios';
import type { Player, APIResponse } from '../types';

export interface PlayerListParams {
  page?: number;
  pageSize?: number;
  country?: string;
  search?: string;
}

export interface PlayerStats {
  totalTournaments: number;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export class Players {
  private readonly axios: AxiosInstance;
  private readonly basePath = '/players';

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * List players with optional filtering
   */
  async list(params: PlayerListParams = {}): Promise<APIResponse<Player[]>> {
    const response = await this.axios.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Retrieve a single player by ID
   */
  async retrieve(id: string): Promise<Player> {
    const response = await this.axios.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Get player statistics
   */
  async getStats(id: string): Promise<PlayerStats> {
    const response = await this.axios.get(`${this.basePath}/${id}/stats`);
    return response.data;
  }

  /**
   * Get a player's tournament history
   */
  async getTournaments(id: string, params: { page?: number; pageSize?: number } = {}): Promise<APIResponse<Array<{
    tournamentId: string;
    tournamentName: string;
    placement: number;
    points: number;
    wins: number;
    losses: number;
    draws: number;
  }>>> {
    const response = await this.axios.get(`${this.basePath}/${id}/tournaments`, { params });
    return response.data;
  }

  /**
   * Get a player's match history
   */
  async getMatches(id: string, params: { page?: number; pageSize?: number } = {}): Promise<APIResponse<Array<{
    matchId: string;
    tournamentId: string;
    tournamentName: string;
    round: number;
    opponentId: string;
    opponentName: string;
    result: 'win' | 'loss' | 'draw';
    score: string;
  }>>> {
    const response = await this.axios.get(`${this.basePath}/${id}/matches`, { params });
    return response.data;
  }
} 