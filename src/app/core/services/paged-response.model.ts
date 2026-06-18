export interface PagedResponse<TData> {
  data: TData | null;
  message?: string;

  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
