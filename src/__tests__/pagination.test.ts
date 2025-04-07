import { PaginatedResponse } from '../utils/pagination';
import type { APIResponse } from '../types';

interface TestData {
  id: number;
}

describe('PaginatedResponse', () => {
  const mockRequest = jest.fn();
  const mockResponse: APIResponse<TestData[]> = {
    data: [{ id: 1 }, { id: 2 }],
    meta: {
      total: 4,
      page: 1,
      pageSize: 2,
      hasMore: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('firstPage', () => {
    it('should return the first page of results', async () => {
      mockRequest.mockResolvedValueOnce(mockResponse);

      const paginator = new PaginatedResponse<TestData>(mockRequest, 20, '/test');
      const response = await paginator.firstPage();

      expect(mockRequest).toHaveBeenCalledWith('/test', {
        params: { page: 1, pageSize: 20 },
      });
      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta?.total).toBe(4);
      expect(response.meta?.hasMore).toBe(true);
    });
  });

  describe('next', () => {
    it('should return the next page of results', async () => {
      const nextResponse: APIResponse<TestData[]> = {
        data: [{ id: 3 }, { id: 4 }],
        meta: {
          total: 4,
          page: 2,
          pageSize: 2,
          hasMore: false,
        },
      };

      mockRequest
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(nextResponse);

      const paginator = new PaginatedResponse<TestData>(mockRequest, 20, '/test');
      await paginator.firstPage();
      const result = await paginator.next();

      expect(mockRequest).toHaveBeenNthCalledWith(2, '/test', {
        params: { page: 2, pageSize: 20 },
      });
      expect(result).toEqual({ value: nextResponse.data, done: false });
    });

    it('should return done when there are no more pages', async () => {
      const lastResponse: APIResponse<TestData[]> = {
        data: [{ id: 1 }],
        meta: {
          total: 1,
          page: 1,
          pageSize: 2,
          hasMore: false,
        },
      };

      mockRequest.mockResolvedValueOnce(lastResponse);

      const paginator = new PaginatedResponse<TestData>(mockRequest, 20, '/test');
      await paginator.firstPage();
      const result = await paginator.next();

      expect(result).toEqual({ value: [], done: true });
    });
  });

  describe('all', () => {
    it('should return all items across all pages', async () => {
      const nextResponse: APIResponse<TestData[]> = {
        data: [{ id: 3 }, { id: 4 }],
        meta: {
          total: 4,
          page: 2,
          pageSize: 2,
          hasMore: false,
        },
      };

      mockRequest
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(nextResponse);

      const paginator = new PaginatedResponse<TestData>(mockRequest, 20, '/test');
      const allItems = await paginator.all();

      expect(allItems).toEqual([
        ...mockResponse.data,
        ...nextResponse.data,
      ]);
    });
  });

  describe('Symbol.asyncIterator', () => {
    it('should allow async iteration over all pages', async () => {
      const nextResponse: APIResponse<TestData[]> = {
        data: [{ id: 3 }, { id: 4 }],
        meta: {
          total: 4,
          page: 2,
          pageSize: 2,
          hasMore: false,
        },
      };

      mockRequest
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(nextResponse);

      const paginator = new PaginatedResponse<TestData>(mockRequest, 20, '/test');
      const items: TestData[] = [];

      for await (const page of paginator) {
        items.push(...page);
      }

      expect(items).toEqual([
        ...mockResponse.data,
        ...nextResponse.data,
      ]);
    });
  });
}); 