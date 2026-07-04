import { Book } from 'types';

export const PRESET_BG_COLORS = [
  '#E63946',
  '#1D3557',
  '#2D6A4F',
  '#264653',
  '#3D405B',
  '#6D6875',
  '#E9C46A',
  '#F4A261',
  '#81B29A',
  '#023E8A',
];

export const PRESET_TEXT_COLORS = [
  '#FFFFFF',
  '#F8F9FA',
  '#FFF9C4',
  '#FFE0B2',
  '#E8F5E9',
  '#111827',
  '#1D3557',
  '#2D3748',
  '#4A1942',
  '#7B2D00',
];

export const LIGHT_COLORS = new Set([
  '#FFFFFF',
  '#F8F9FA',
  '#FFF9C4',
  '#FFE0B2',
  '#E8F5E9',
]);

export const PREVIEW_BASE: Omit<
  Book,
  'coverColor' | 'coverTextColor' | 'title' | 'author'
> = {
  id: 0,
  rating: 4.5,
  reviewCount: 0,
  categories: [],
  description: '',
  published: 2024,
  reviews: [],
  pages: 0,
  language: 'English',
};
