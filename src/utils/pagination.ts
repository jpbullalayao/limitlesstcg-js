import type { APIResponse } from '../types';

export class PaginatedResponse<T> implements AsyncIterator<T[]>, AsyncIterable<T[]> {
  private currentPage = 1;
  private hasMore = true;
  private total = 0;
  private initialResponse: APIResponse<T[]> | null = null;
  private params: Record<string, string | number> = {};

  constructor(
    private request: (path: string, options?: Record<string, unknown>) => Promise<APIResponse<T[]>>,
    private pageSize = 20,
    private path = ''
  ) {}

  setParams(params: Record<string, string | number | undefined>): void {
    this.params = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);
  }

  async firstPage(): Promise<APIResponse<T[]>> {
    const response = await this.request(this.path, {
      params: { ...this.params, page: 1, pageSize: this.pageSize },
    });

    this.initialResponse = response;
    this.currentPage = 1;
    this.total = response.meta?.total ?? 0;
    this.hasMore = response.meta?.hasMore ?? false;

    return response;
  }

  async next(): Promise<IteratorResult<T[]>> {
    if (!this.initialResponse) {
      const response = await this.firstPage();
      return { value: response.data, done: false };
    }

    if (!this.hasMore) {
      return { value: [], done: true };
    }

    this.currentPage++;
    const response = await this.request(this.path, {
      params: { ...this.params, page: this.currentPage, pageSize: this.pageSize },
    });

    this.hasMore = response.meta?.hasMore ?? false;
    return { value: response.data, done: false };
  }

  async all(): Promise<T[]> {
    const items: T[] = [];
    const firstPage = await this.firstPage();
    items.push(...firstPage.data);

    let result = await this.next();
    while (!result.done) {
      items.push(...result.value);
      result = await this.next();
    }

    return items;
  }

  [Symbol.asyncIterator](): AsyncIterator<T[]> {
    return this;
  }
}

export async function createPaginatedResponse<T>(
  fetchFunction: (params: PaginationParams) => Promise<APIResponse<T[]>>,
  pageSize = 20
): Promise<PaginatedResponse<T>> {
  const response = await fetchFunction({ page: 1, pageSize });
  return new PaginatedResponse(response, fetchFunction);
}

export type { PaginatedResponse as PaginatedResponseType }; 