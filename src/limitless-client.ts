import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import axios from 'axios';
import type { LimitlessConfig } from './types';
import { Tournaments } from './resources/tournaments';
import { Players } from './resources/players';
import { Decklists } from './resources/decklists';
import { Matches } from './resources/matches';
import { LimitlessAPIError, LimitlessAuthenticationError, LimitlessNetworkError } from './errors';

export class LimitlessClient {
  private readonly axios: AxiosInstance;
  private static DEFAULT_BASE_URL = 'https://api.limitlesstcg.com/v1';
  private static DEFAULT_TIMEOUT = 10000;

  public readonly tournaments: Tournaments;
  public readonly players: Players;
  public readonly decklists: Decklists;
  public readonly matches: Matches;

  constructor(config: LimitlessConfig = {}) {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: config.baseURL || LimitlessClient.DEFAULT_BASE_URL,
      timeout: config.timeout || LimitlessClient.DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (config.apiKey) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        Authorization: `Bearer ${config.apiKey}`,
      };
    }

    if (config.version) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Limitless-Version': config.version,
      };
    }

    this.axios = axios.create(axiosConfig);

    // Initialize resources
    this.tournaments = new Tournaments(this.axios);
    this.players = new Players(this.axios);
    this.decklists = new Decklists(this.axios);
    this.matches = new Matches(this.axios);

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { data, status } = error.response;
          
          if (status === 401) {
            throw new LimitlessAuthenticationError('Invalid API key or insufficient permissions');
          }

          throw new LimitlessAPIError(
            (data as any)?.message || 'An unknown error occurred',
            status,
            error
          );
        }
        throw new LimitlessNetworkError(error.message || 'Network error occurred', error);
      }
    );
  }

  /**
   * Set a new API key for the client
   */
  public setApiKey(apiKey: string): void {
    this.axios.defaults.headers.common.Authorization = `Bearer ${apiKey}`;
  }

  /**
   * Set a specific API version
   */
  public setApiVersion(version: string): void {
    this.axios.defaults.headers.common['Limitless-Version'] = version;
  }
} 