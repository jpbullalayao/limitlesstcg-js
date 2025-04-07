import type { APIResponse, Decklist, DecklistListParams, CreateDecklistParams, UpdateDecklistParams } from '../types';
import { PaginatedResponse } from '../utils/pagination';

type DecklistResponse<T> = APIResponse<T>;

export class Decklists {
  constructor(private request: (path: string, options?: Record<string, unknown>) => Promise<DecklistResponse<Decklist | Decklist[]>>) {}

  list(params: DecklistListParams = {}): PaginatedResponse<Decklist> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<Decklist[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<Decklist[]>;
    };

    const paginator = new PaginatedResponse<Decklist>(wrappedRequest, 20, '/decklists');
    paginator.setParams(params);
    return paginator;
  }

  async retrieve(id: string): Promise<Decklist> {
    const response = await this.request(`/decklists/${id}`);
    return response.data as Decklist;
  }

  async create(params: CreateDecklistParams): Promise<Decklist> {
    const response = await this.request('/decklists', {
      method: 'POST',
      body: params,
    });
    return response.data as Decklist;
  }

  async update(id: string, params: UpdateDecklistParams): Promise<Decklist> {
    const response = await this.request(`/decklists/${id}`, {
      method: 'PATCH',
      body: params,
    });
    return response.data as Decklist;
  }

  async delete(id: string): Promise<void> {
    await this.request(`/decklists/${id}`, {
      method: 'DELETE',
    });
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
    const response = await this.request(`${this.basePath}/${id}/similar`, { params });
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
    const response = await this.request(`${this.basePath}/${id}/archetype-stats`);
    return response.data;
  }
} 