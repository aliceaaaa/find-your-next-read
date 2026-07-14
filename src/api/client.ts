const BASE_URL = 'https://api.findyournextread.com/api';
const TOKEN_KEY = 'auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

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
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

export type ApiBook = {
  id: number;
  title: string;
  author: string;
  cover_color: string;
  cover_text_color: string;
  categories: string[] | null;
  description: string | Record<string, unknown> | null;
  published: string | null;
  pages: number | null;
  language: string | null;
  isbn: string | null;
  created_at: string;
  updated_at: string;
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

export type ApiReview = {
  id: number;
  author: string;
  text: string;
  book_id: number;
  rating: number;
  language: string | null;
  created_at: string;
  updated_at: string;
};

export const apiGetBooks = (page = 1): Promise<ApiPaginatedResponse<ApiBook>> =>
  request<ApiPaginatedResponse<ApiBook>>(`/books?page=${page}`);

export const apiGetBook = (id: number): Promise<ApiBook> =>
  request<ApiBook>(`/books/${id}`);

export const apiGetReviews = (
  page = 1,
): Promise<ApiPaginatedResponse<ApiReview>> =>
  request<ApiPaginatedResponse<ApiReview>>(`/reviews?page=${page}`);
