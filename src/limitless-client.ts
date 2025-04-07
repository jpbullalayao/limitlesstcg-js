import type { APIResponse, LimitlessConfig, RequestOptions } from './types';
import { Players } from './resources/players';
import { Tournaments } from './resources/tournaments';
import { Decklists } from './resources/decklists';
import { Matches } from './resources/matches';
import { LimitlessAPIError } from './errors';

export class LimitlessClient {
  private baseURL: string;
  private timeout: number;
  private apiKey?: string;
  private version: string;

  public readonly tournaments: Tournaments;
  public readonly players: Players;
  public readonly decklists: Decklists;
  public readonly matches: Matches;

  constructor(config: LimitlessConfig = {}) {
    this.baseURL = config.baseURL || 'https://play.limitlesstcg.com/api';
    this.timeout = config.timeout || 30000;
    this.apiKey = config.apiKey;
    this.version = config.version || 'v1';

    // Initialize resources with the request method
    this.tournaments = new Tournaments(this.request.bind(this));
    this.players = new Players(this.request.bind(this));
    this.decklists = new Decklists(this.request.bind(this));
    this.matches = new Matches(this.request.bind(this));
  }

  private buildURL(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseURL}/${cleanPath}`;
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private buildQueryString(params?: Record<string, string | number>): string {
    if (!params) return '';
    const query = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return query ? `?${query}` : '';
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
    const url = this.buildURL(path) + this.buildQueryString(options.params);
    const headers = { ...this.buildHeaders(), ...options.headers };
    const requestOptions: RequestInit = {
      headers,
    };

    if (options.method) {
      requestOptions.method = options.method;
    }

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new LimitlessAPIError(
          `Request failed with status ${response.status}: ${data.message || 'An unknown error occurred'}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof LimitlessAPIError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new LimitlessAPIError('Network error', 500, { message: error.message });
      }
      throw new LimitlessAPIError('Network error', 500, { message: 'Network error' });
    }
  }

  /**
   * Set a new API key for the client
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set a specific API version
   */
  public setApiVersion(version: string): void {
    this.version = version;
  }
} 