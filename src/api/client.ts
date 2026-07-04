const BASE_URL = 'https://api.findyournextread.com/api';
const TOKEN_KEY = 'auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    let errors: Record<string, string[]> | undefined;
    try {
      const body = await res.json();
      message = body.message || message;
      errors = body.errors;
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, message, errors);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

export type ApiReview = {
  id: number;
  author: string;
  text: string;
  book_id: number;
  rating: number;
  language: string;
  created_at: string;
  updated_at: string;
};

export type ApiBook = {
  id: number;
  title: string;
  author: string;
  cover_color: string;
  cover_text_color: string;
  categories: string[] | null;
  description: string | Record<string, unknown> | null;
  reviews: ApiReview[] | null;
  next_books?: ApiBook[] | null;
  published: string | null;
  pages: number | null;
  language: string | null;
  isbn: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiBookPayload = {
  title: string;
  author: string;
  cover_color?: string;
  cover_text_color?: string;
  categories?: string[];
  description?: Record<string, unknown>;
  published?: string | null;
  pages?: number | null;
  language?: string | null;
  isbn?: string | null;
};

export type ApiReviewPayload = {
  author: string;
  text: string;
  book_id: number;
  rating: number;
  language: string;
};

export type ApiPaginatedResponse<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export type LoginResponse = {
  user: { id: number; name: string; email: string };
  token: string;
};

export const apiLogin = (
  email: string,
  password: string,
): Promise<LoginResponse> =>
  request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const apiGetBooks = (page = 1): Promise<ApiPaginatedResponse<ApiBook>> =>
  request<ApiPaginatedResponse<ApiBook>>(`/books?page=${page}`);

export const apiGetBook = (id: number): Promise<ApiBook> =>
  request<ApiBook>(`/books/${id}?include=reviews,nextBooks`);

export const apiCreateBook = (payload: ApiBookPayload): Promise<ApiBook> =>
  request<ApiBook>('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiUpdateBook = (
  id: number,
  payload: ApiBookPayload,
): Promise<ApiBook> =>
  request<ApiBook>(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const apiDeleteBook = (id: number): Promise<void> =>
  request<void>(`/books/${id}`, { method: 'DELETE' });

export const apiAttachNextBooks = (
  id: number,
  nextBookIds: number[],
): Promise<ApiBook> =>
  request<ApiBook>(`/books/${id}/next-books`, {
    method: 'POST',
    body: JSON.stringify({ next_book_ids: nextBookIds }),
  });

export const apiDetachNextBook = (
  id: number,
  nextBookId: number,
): Promise<void> =>
  request<void>(`/books/${id}/next-books/${nextBookId}`, {
    method: 'DELETE',
  });

export const apiCreateReview = (
  payload: ApiReviewPayload,
): Promise<ApiReview> =>
  request<ApiReview>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiUpdateReview = (
  id: number,
  payload: Partial<ApiReviewPayload>,
): Promise<ApiReview> =>
  request<ApiReview>(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const apiDeleteReview = (id: number): Promise<void> =>
  request<void>(`/reviews/${id}`, { method: 'DELETE' });
