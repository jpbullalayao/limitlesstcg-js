import { LimitlessClient } from '../limitless-client';
import { Players } from '../resources/players';
import { Tournaments } from '../resources/tournaments';
import type { RequestOptions } from '../limitless-client';

describe('LimitlessClient', () => {
  let client: LimitlessClient;

  beforeEach(() => {
    client = new LimitlessClient();
  });

  it('should initialize with default options', () => {
    expect(Reflect.get(client, 'baseURL')).toBe('https://play.limitlesstcg.com/api');
  });

  it('should initialize with custom options', () => {
    const customClient = new LimitlessClient({
      baseURL: 'https://custom.api.com',
    });
    expect(Reflect.get(customClient, 'baseURL')).toBe('https://custom.api.com');
  });

  it('should expose resource classes', () => {
    expect(client.tournaments).toBeInstanceOf(Tournaments);
    expect(client.players).toBeInstanceOf(Players);
  });

  describe('request', () => {
    let mockFetch: jest.Mock;

    beforeEach(() => {
      mockFetch = jest.fn();
      global.fetch = mockFetch;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should make a GET request with query parameters', async () => {
      const mockResponse = { data: { id: 1 } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const request = Reflect.get(client, 'request').bind(client);
      const result = await request('/test', {
        params: { page: 1 },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://play.limitlesstcg.com/api/test?page=1',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should make a POST request with body', async () => {
      const mockResponse = { data: { id: 1 } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const body = { name: 'test' };
      const request = Reflect.get(client, 'request').bind(client);
      const result = await request('/test', {
        method: 'POST',
        body,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://play.limitlesstcg.com/api/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const errorResponse = {
        error: 'Not Found',
        message: 'Resource not found',
      };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      const request = Reflect.get(client, 'request').bind(client);
      await expect(request('/test')).rejects.toThrow(
        'Request failed with status 404: Resource not found'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = Reflect.get(client, 'request').bind(client);
      await expect(request('/test')).rejects.toThrow('Network error');
    });
  });
}); 