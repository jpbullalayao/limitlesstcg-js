import type { APIResponse, Decklist, DecklistListParams, CreateDecklistParams, UpdateDecklistParams } from '../types';
import { PaginatedResponse } from '../utils/pagination';

type DecklistResponse<T> = APIResponse<T>;

export class Decklists {
  private readonly basePath = '/decklists';

  constructor(private request: <T>(path: string, options?: Record<string, unknown>) => Promise<DecklistResponse<T>>) {}

  list(params: DecklistListParams = {}): PaginatedResponse<Decklist> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<Decklist[]>> => {
      const response = await this.request<Decklist[]>(path, options);
      return response;
    };

    const paginator = new PaginatedResponse<Decklist>(wrappedRequest, 20, this.basePath);
    paginator.setParams(params);
    return paginator;
  }

  async retrieve(id: string): Promise<Decklist> {
    const response = await this.request<Decklist>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(params: CreateDecklistParams): Promise<Decklist> {
    const response = await this.request<Decklist>(this.basePath, {
      method: 'POST',
      body: params,
    });
    return response.data;
  }

  async update(id: string, params: UpdateDecklistParams): Promise<Decklist> {
    const response = await this.request<Decklist>(`${this.basePath}/${id}`, {
      method: 'PATCH',
      body: params,
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get similar decklists
   */
  async getSimilar(id: string, params: { page?: number; pageSize?: number } = {}): Promise<{
    decklistId: string;
    decklistName: string;
    playerId: string;
    playerName: string;
    similarity: number;
    cardDifferences: Array<{
      card: string;
      quantityDiff: number;
    }>;
  }[]> {
    type SimilarDecklistResponse = {
      decklistId: string;
      decklistName: string;
      playerId: string;
      playerName: string;
      similarity: number;
      cardDifferences: Array<{
        card: string;
        quantityDiff: number;
      }>;
    }[];
    
    const response = await this.request<SimilarDecklistResponse>(`${this.basePath}/${id}/similar`, { params });
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
    type ArchetypeStatsResponse = {
      totalPlayers: number;
      averagePlacement: number;
      winRate: number;
      popularCards: Array<{
        cardId: string;
        cardName: string;
        frequency: number;
      }>;
    };
    
    const response = await this.request<ArchetypeStatsResponse>(`${this.basePath}/${id}/archetype-stats`);
    return response.data;
  }
} 