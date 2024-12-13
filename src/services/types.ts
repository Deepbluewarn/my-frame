export interface SearchResult<T> {
    results: T[];
    totalCount: number;
    totalPages: number;
}