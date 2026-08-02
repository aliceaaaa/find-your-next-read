import { ApiCategory, apiGetCategories } from './client';

export type Category = {
  name: string;
  booksCount: number;
};

const mapApiCategory = (c: ApiCategory): Category => ({
  name: c.name,
  booksCount: c.books_count ?? 0,
});

export const fetchCategories = async (): Promise<Category[]> => {
  const categories: Category[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await apiGetCategories(page);
    categories.push(...res.data.map(mapApiCategory));
    lastPage = res.last_page;
  } while (page++ < lastPage);

  return categories;
};
