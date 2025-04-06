import type { AxiosInstance } from 'axios';
import type { Match, APIResponse } from '../types';

export interface MatchListParams {
  page?: number;
  pageSize?: number;
  tournamentId?: string;
  playerId?: string;
  round?: number;
  status?: string;
}

export interface MatchCreateParams {
  tournamentId: string;
  round: number;
  table: number;
  player1Id: string;
  player2Id: string;
}

export interface MatchUpdateParams {
  player1Score?: number;
  player2Score?: number;
  status?: string;
  winner?: string;
}

export class Matches {
  private readonly axios: AxiosInstance;
  private readonly basePath = '/matches';

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * List matches with optional filtering
   */
  async list(params: MatchListParams = {}): Promise<APIResponse<Match[]>> {
    const response = await this.axios.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Retrieve a single match by ID
   */
  async retrieve(id: string): Promise<Match> {
    const response = await this.axios.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new match (requires tournament organizer authentication)
   */
  async create(params: MatchCreateParams): Promise<Match> {
    const response = await this.axios.post(this.basePath, params);
    return response.data;
  }

  /**
   * Update an existing match (requires tournament organizer authentication)
   */
  async update(id: string, params: MatchUpdateParams): Promise<Match> {
    const response = await this.axios.patch(`${this.basePath}/${id}`, params);
    return response.data;
  }

  /**
   * Delete a match (requires tournament organizer authentication)
   */
  async delete(id: string): Promise<void> {
    await this.axios.delete(`${this.basePath}/${id}`);
  }

  /**
   * Report match result (requires player authentication)
   */
  async reportResult(id: string, params: {
    reportingPlayerId: string;
    playerScore: number;
    opponentScore: number;
  }): Promise<Match> {
    const response = await this.axios.post(`${this.basePath}/${id}/report`, params);
    return response.data;
  }

  /**
   * Get match statistics between two players
   */
  async getHeadToHead(player1Id: string, player2Id: string): Promise<{
    totalMatches: number;
    player1Wins: number;
    player2Wins: number;
    draws: number;
    recentMatches: Array<{
      matchId: string;
      tournamentId: string;
      tournamentName: string;
      date: string;
      winner: string;
      score: string;
    }>;
  }> {
    const response = await this.axios.get(`${this.basePath}/head-to-head`, {
      params: { player1Id, player2Id }
    });
    return response.data;
  }
} 