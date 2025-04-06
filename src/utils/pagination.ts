import type { APIResponse } from '../types';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export class PaginatedResponse<T> implements AsyncIterator<T[]>, AsyncIterable<T[]> {
  private currentPage: number;
  private readonly pageSize: number;
  private readonly fetchFunction: (params: PaginationParams) => Promise<APIResponse<T[]>>;
  private hasMore: boolean = true;

  constructor(
    fetchFunction: (params: PaginationParams) => Promise<APIResponse<T[]>>,
    pageSize: number = 20
  ) {
    this.fetchFunction = fetchFunction;
    this.currentPage = 1;
    this.pageSize = pageSize;
  }

  public [Symbol.asyncIterator](): AsyncIterator<T[]> {
    return this;
  }

  public async next(): Promise<IteratorResult<T[]>> {
    if (!this.hasMore) {
      return { done: true, value: [] };
    }

    const response = await this.fetchFunction({
      page: this.currentPage,
      pageSize: this.pageSize,
    });

    const meta = response.meta || {};
    const total = meta.total || 0;
    this.hasMore = (this.currentPage * this.pageSize) < total;
    this.currentPage++;

    return {
      done: false,
      value: response.data,
    };
  }

  /**
   * Get all items by automatically fetching all pages
   */
  public async all(): Promise<T[]> {
    const allItems: T[] = [];
    for await (const items of this) {
      allItems.push(...items);
    }
    return allItems;
  }

  /**
   * Get items from the first page only
   */
  public async firstPage(): Promise<{
    data: T[];
    meta: PaginationMeta;
  }> {
    const response = await this.fetchFunction({
      page: 1,
      pageSize: this.pageSize,
    });

    const meta = response.meta || {};
    const total = meta.total || 0;
    
    return {
      data: response.data,
      meta: {
        total,
        page: 1,
        pageSize: this.pageSize,
        hasMore: this.pageSize < total,
      },
    };
  }
}

/**
 * Create a paginated response that can be used to iterate over all pages
 */
export function createPaginatedResponse<T>(
  fetchFunction: (params: PaginationParams) => Promise<APIResponse<T[]>>,
  pageSize?: number
): PaginatedResponse<T> {
  return new PaginatedResponse(fetchFunction, pageSize);
} 