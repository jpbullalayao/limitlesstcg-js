import type { APIResponse, Match, MatchListParams, CreateMatchParams, UpdateMatchParams } from '../types';
import { PaginatedResponse } from '../utils/pagination';

type MatchResponse<T> = APIResponse<T>;

export class Matches {
  constructor(private request: (path: string, options?: Record<string, unknown>) => Promise<MatchResponse<Match | Match[]>>) {}

  list(params: MatchListParams = {}): PaginatedResponse<Match> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<Match[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<Match[]>;
    };

    const paginator = new PaginatedResponse<Match>(wrappedRequest, 20, '/matches');
    paginator.setParams(params);
    return paginator;
  }

  async retrieve(id: string): Promise<Match> {
    const response = await this.request(`/matches/${id}`);
    return response.data as Match;
  }

  async create(params: CreateMatchParams): Promise<Match> {
    const response = await this.request('/matches', {
      method: 'POST',
      body: params,
    });
    return response.data as Match;
  }

  async update(id: string, params: UpdateMatchParams): Promise<Match> {
    const response = await this.request(`/matches/${id}`, {
      method: 'PATCH',
      body: params,
    });
    return response.data as Match;
  }

  async delete(id: string): Promise<void> {
    await this.request(`/matches/${id}`, {
      method: 'DELETE',
    });
  }
}