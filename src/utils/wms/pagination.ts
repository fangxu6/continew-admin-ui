/**
 * WMS Pagination and Filtering Helpers
 */

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENT_PAGE = 1;

// Create pagination object for API requests
export function createPagination(page: number = DEFAULT_CURRENT_PAGE, size: number = DEFAULT_PAGE_SIZE) {
  return {
    page,
    size
  };
}

// Create query object with pagination
export function createQueryWithPagination<T extends Record<string, any>>(
  query: T,
  page: number = DEFAULT_CURRENT_PAGE,
  size: number = DEFAULT_PAGE_SIZE
): T & { page: number; size: number } {
  return {
    ...query,
    page,
    size
  };
}

// Process API response to extract data and pagination info
export function processApiResponse<T>(
  response: any
): {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
} {
  if (!response || !response.data) {
    return {
      data: [],
      total: 0,
      currentPage: DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE
    };
  }

  const { list = [], total = 0, page = DEFAULT_CURRENT_PAGE, size = DEFAULT_PAGE_SIZE } = response.data;

  return {
    data: list,
    total,
    currentPage: page,
    pageSize: size
  };
}

// Filter data based on search criteria
export function filterData<T extends Record<string, any>>(
  data: T[],
  filters: Partial<T>
): T[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true; // Skip empty filters
      }
      
      const itemValue = item[key];
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      return itemValue === value;
    });
  });
}