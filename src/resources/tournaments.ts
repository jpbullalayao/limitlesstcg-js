import type { APIResponse, Tournament, TournamentListParams, CreateTournamentParams, UpdateTournamentParams, TournamentStanding } from '../types';
import { PaginatedResponse } from '../utils/pagination';

type TournamentResponse<T> = APIResponse<T>;

export class Tournaments {
  constructor(private request: (path: string, options?: Record<string, unknown>) => Promise<TournamentResponse<Tournament | Tournament[] | TournamentStanding[]>>) {}

  list(params: TournamentListParams = {}): PaginatedResponse<Tournament> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<Tournament[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<Tournament[]>;
    };

    const paginator = new PaginatedResponse<Tournament>(wrappedRequest, 20, '/tournaments');
    paginator.setParams(params);
    return paginator;
  }

  async retrieve(id: string): Promise<Tournament> {
    const response = await this.request(`/tournaments/${id}`);
    return response.data as Tournament;
  }

  async create(params: CreateTournamentParams): Promise<Tournament> {
    const response = await this.request('/tournaments', {
      method: 'POST',
      body: params,
    });
    return response.data as Tournament;
  }

  async update(id: string, params: UpdateTournamentParams): Promise<Tournament> {
    const response = await this.request(`/tournaments/${id}`, {
      method: 'PATCH',
      body: params,
    });
    return response.data as Tournament;
  }

  async delete(id: string): Promise<void> {
    await this.request(`/tournaments/${id}`, {
      method: 'DELETE',
    });
  }

  getStandings(id: string): PaginatedResponse<TournamentStanding> {
    const wrappedRequest = async (path: string, options?: Record<string, unknown>): Promise<APIResponse<TournamentStanding[]>> => {
      const response = await this.request(path, options);
      return response as APIResponse<TournamentStanding[]>;
    };

    return new PaginatedResponse<TournamentStanding>(
      wrappedRequest,
      20,
      `/tournaments/${id}/standings`
    );
  }
} 