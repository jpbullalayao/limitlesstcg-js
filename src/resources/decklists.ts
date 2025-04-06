import type { AxiosInstance } from 'axios';
import type { Decklist, APIResponse } from '../types';

export interface DecklistListParams {
  page?: number;
  pageSize?: number;
  format?: string;
  playerId?: string;
  tournamentId?: string;
  search?: string;
}

export interface DecklistCreateParams {
  name: string;
  format: string;
  cards: Array<{
    id: string;
    quantity: number;
  }>;
  isPublic?: boolean;
  tournamentId?: string;
  description?: string;
}

export class Decklists {
  private readonly axios: AxiosInstance;
  private readonly basePath = '/decklists';

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * List decklists with optional filtering
   */
  async list(params: DecklistListParams = {}): Promise<APIResponse<Decklist[]>> {
    const response = await this.axios.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Retrieve a single decklist by ID
   */
  async retrieve(id: string): Promise<Decklist> {
    const response = await this.axios.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new decklist (requires authentication)
   */
  async create(params: DecklistCreateParams): Promise<Decklist> {
    const response = await this.axios.post(this.basePath, params);
    return response.data;
  }

  /**
   * Update an existing decklist (requires authentication)
   */
  async update(id: string, params: Partial<DecklistCreateParams>): Promise<Decklist> {
    const response = await this.axios.patch(`${this.basePath}/${id}`, params);
    return response.data;
  }

  /**
   * Delete a decklist (requires authentication)
   */
  async delete(id: string): Promise<void> {
    await this.axios.delete(`${this.basePath}/${id}`);
  }

  /**
   * Get similar decklists
   */
  async getSimilar(id: string, params: { page?: number; pageSize?: number } = {}): Promise<APIResponse<Array<{
    decklistId: string;
    decklistName: string;
    playerId: string;
    playerName: string;
    similarity: number;
    cardDifferences: Array<{
      card: string;
      quantityDiff: number;
    }>;
  }>>> {
    const response = await this.axios.get(`${this.basePath}/${id}/similar`, { params });
    return response.data;
  }

  /**
   * Get tournament performance for a decklist archetype
   */
  async getArchetypeStats(id: string): Promise<{
    totalPlayers: number;
    averagePlacement: number;
    winRate: number;
    popularCards: Array<{
      cardId: string;
      cardName: string;
      frequency: number;
    }>;
  }> {
    const response = await this.axios.get(`${this.basePath}/${id}/archetype-stats`);
    return response.data;
  }
} 