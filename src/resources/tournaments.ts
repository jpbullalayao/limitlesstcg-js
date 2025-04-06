import type { AxiosInstance } from 'axios';
import type { Tournament, APIResponse } from '../types';
import { createPaginatedResponse, PaginatedResponse } from '../utils/pagination';

export interface TournamentListParams {
  page?: number;
  pageSize?: number;
  format?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TournamentCreateParams {
  name: string;
  format: string;
  startDate: string;
  endDate: string;
  type: string;
  description?: string;
}

export class Tournaments {
  private readonly axios: AxiosInstance;
  private readonly basePath = '/tournaments';

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * List tournaments with optional filtering
   * @returns A paginated response that can be used to iterate over all tournaments
   * @example
   * // Get first page
   * const { data, meta } = await tournaments.list().firstPage();
   * 
   * // Iterate over all pages
   * for await (const page of tournaments.list()) {
   *   console.log(page); // Array of tournaments
   * }
   * 
   * // Get all tournaments at once
   * const allTournaments = await tournaments.list().all();
   */
  list(params: Omit<TournamentListParams, 'page' | 'pageSize'> = {}): PaginatedResponse<Tournament> {
    return createPaginatedResponse((paginationParams) => {
      return this.axios.get(this.basePath, {
        params: { ...params, ...paginationParams }
      }).then(response => response.data);
    });
  }

  /**
   * Retrieve a single tournament by ID
   */
  async retrieve(id: string): Promise<Tournament> {
    const response = await this.axios.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new tournament (requires authentication)
   */
  async create(params: TournamentCreateParams): Promise<Tournament> {
    const response = await this.axios.post(this.basePath, params);
    return response.data;
  }

  /**
   * Update an existing tournament (requires authentication)
   */
  async update(id: string, params: Partial<TournamentCreateParams>): Promise<Tournament> {
    const response = await this.axios.patch(`${this.basePath}/${id}`, params);
    return response.data;
  }

  /**
   * Delete a tournament (requires authentication)
   */
  async delete(id: string): Promise<void> {
    await this.axios.delete(`${this.basePath}/${id}`);
  }

  /**
   * Get standings for a tournament
   */
  async getStandings(id: string): Promise<APIResponse<Array<{
    rank: number;
    playerId: string;
    playerName: string;
    points: number;
    wins: number;
    losses: number;
    draws: number;
  }>>> {
    const response = await this.axios.get(`${this.basePath}/${id}/standings`);
    return response.data;
  }
} 