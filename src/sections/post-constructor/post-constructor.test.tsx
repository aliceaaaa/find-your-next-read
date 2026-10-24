import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  apiCreateBook,
  apiDeleteBookCover,
  apiGetBook,
  apiRemoveNextBook,
  apiSetNextBooks,
  apiUpdateBook,
  apiUploadBookCover,
} from 'api';
import { AuthProvider } from '../../contexts/auth-context';
import { PostConstructor } from './post-constructor';

jest.mock('api', () => ({
  ...jest.requireActual('api'),
  apiCreateBook: jest.fn(),
  apiGetBook: jest.fn(),
  apiUpdateBook: jest.fn(),
  apiUploadBookCover: jest.fn(),
  apiDeleteBookCover: jest.fn(),
  apiSetNextBooks: jest.fn(),
  apiRemoveNextBook: jest.fn(),
  // Book list for the "Read next" picker; keeps tests off the network.
  fetchBooks: jest.fn(() => Promise.resolve([])),
}));

beforeEach(() => {
  (apiCreateBook as jest.Mock).mockResolvedValue({ id: 1 });
  (apiUpdateBook as jest.Mock).mockResolvedValue({ id: 5 });
  (apiUploadBookCover as jest.Mock).mockResolvedValue({ id: 1 });
  (apiDeleteBookCover as jest.Mock).mockResolvedValue(undefined);
  (apiSetNextBooks as jest.Mock).mockResolvedValue(undefined);
  (apiRemoveNextBook as jest.Mock).mockResolvedValue(undefined);
});

const renderWith = (
  isAdmin: boolean,
  props: Parameters<typeof PostConstructor>[0] = {},
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider defaultIsAdmin={isAdmin}>
        <PostConstructor {...props} />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

const pickCover = async () => {
  const file = new File(['png'], 'cover.png', { type: 'image/png' });
  fireEvent.change(screen.getByTestId('file-input'), {
    target: { files: [file] },
  });
  await screen.findByAltText('Upload preview');
  return file;
};

const renderDefault = () => renderWith(false);
const renderAsAdmin = () => renderWith(true);

const fillRequired = () => {
  fireEvent.change(screen.getByLabelText(/^title/i), {
    target: { value: 'My Book' },
  });
  fireEvent.change(screen.getByLabelText(/^author/i), {
    target: { value: 'Jane Doe' },
  });
};

describe('PostConstructor', () => {
  describe('access control', () => {
    it('shows access denied screen when not admin', () => {
      renderDefault();
      expect(screen.getByTestId('access-denied')).toBeInTheDocument();
    });

    it('shows Access Denied heading when not admin', () => {
      renderDefault();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('does not show form when not admin', () => {
      renderDefault();
      expect(
        screen.queryByRole('form', { name: /add book form/i }),
      ).not.toBeInTheDocument();
    });

    it('shows form when admin', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('form', { name: /add book form/i }),
      ).toBeInTheDocument();
    });
  });

  describe('admin form', () => {
    it('renders page title', () => {
      renderAsAdmin();
      expect(screen.getByText('Add Book')).toBeInTheDocument();
    });

    it('renders Title field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();
    });

    it('renders Author field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^author/i)).toBeInTheDocument();
    });

    it('renders Year of Publication field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/year of publication/i)).toBeInTheDocument();
    });

    it('renders Pages field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^pages/i)).toBeInTheDocument();
    });

    it('renders Language field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^language/i)).toBeInTheDocument();
    });

    it('renders Categories field', () => {
      renderAsAdmin();
      expect(screen.getByText(/^categories$/i)).toBeInTheDocument();
    });

    it('renders the rich text editor', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('textbox', { name: /what i think/i }),
      ).toBeInTheDocument();
    });

    it('renders image upload zone', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /upload image/i }),
      ).toBeInTheDocument();
    });

    it('renders cover constructor preview', () => {
      renderAsAdmin();
      expect(screen.getByTestId('cover')).toBeInTheDocument();
    });

    it('renders Publish submit button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /publish/i }),
      ).toBeInTheDocument();
    });

    it('renders Reset button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it('shows success screen after a valid submit', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(await screen.findByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByText('Book Added!')).toBeInTheDocument();
    });

    it('shows Add Another button after submit', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(
        await screen.findByRole('button', { name: /add another/i }),
      ).toBeInTheDocument();
    });

    it('returns to form after Add Another click', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      fireEvent.click(await screen.findByRole('button', { name: /add another/i }));
      await waitFor(() =>
        expect(
          screen.getByRole('form', { name: /add book form/i }),
        ).toBeInTheDocument(),
      );
    });

    it('resets title field when Reset is clicked', () => {
      renderAsAdmin();
      fireEvent.change(screen.getByLabelText(/^title/i), {
        target: { value: 'My Book' },
      });
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(screen.getByLabelText(/^title/i)).toHaveValue('');
    });
  });

  describe('cover image', () => {
    it('uploads the picked cover after creating the book', async () => {
      renderAsAdmin();
      fillRequired();
      const file = await pickCover();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(await screen.findByTestId('success-message')).toBeInTheDocument();
      expect(apiCreateBook).toHaveBeenCalledWith(
        expect.not.objectContaining({ cover_image: expect.anything() }),
      );
      expect(apiUploadBookCover).toHaveBeenCalledWith(1, file);
    });

    it('does not upload anything when no cover is picked', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      await screen.findByTestId('success-message');
      expect(apiUploadBookCover).not.toHaveBeenCalled();
      expect(apiDeleteBookCover).not.toHaveBeenCalled();
    });

    it('reports a failed cover upload while keeping the added book', async () => {
      (apiUploadBookCover as jest.Mock).mockRejectedValue(new Error('500'));
      renderAsAdmin();
      fillRequired();
      await pickCover();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(await screen.findByText('Book Added!')).toBeInTheDocument();
      expect(
        screen.getByText(/cover image could not be uploaded/i),
      ).toBeInTheDocument();
    });

    describe('when editing', () => {
      const book = {
        id: 5,
        title: 'Saved Book',
        author: 'Jane Doe',
        cover_color: '#000000',
        cover_text_color: '#FFFFFF',
        categories: [],
        description: null,
        published: null,
        pages: null,
        language: null,
        isbn: null,
        cover: {
          id: 9,
          url: 'https://cdn.example.com/cover.png',
          original_name: 'cover.png',
          mime_type: 'image/png',
          size: 100,
        },
      };

      beforeEach(() => {
        (apiGetBook as jest.Mock).mockResolvedValue(book);
      });

      it('shows the saved cover from cover.url', async () => {
        renderWith(true, { bookId: 5 });
        expect(await screen.findByAltText('Upload preview')).toHaveAttribute(
          'src',
          book.cover.url,
        );
      });

      it('deletes the saved cover when it is removed', async () => {
        const onSaved = jest.fn();
        renderWith(true, { bookId: 5, onSaved });
        await screen.findByAltText('Upload preview');
        fireEvent.click(screen.getByRole('button', { name: /remove image/i }));
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        await waitFor(() => expect(onSaved).toHaveBeenCalledWith(5));
        expect(apiDeleteBookCover).toHaveBeenCalledWith(5);
        expect(apiUploadBookCover).not.toHaveBeenCalled();
      });

      it('keeps the saved cover when it is left untouched', async () => {
        const onSaved = jest.fn();
        renderWith(true, { bookId: 5, onSaved });
        await screen.findByAltText('Upload preview');
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        await waitFor(() => expect(onSaved).toHaveBeenCalledWith(5));
        expect(apiDeleteBookCover).not.toHaveBeenCalled();
        expect(apiUploadBookCover).not.toHaveBeenCalled();
      });

      it('loads the book with its "read next" links', async () => {
        renderWith(true, { bookId: 5 });
        await screen.findByAltText('Upload preview');
        expect(apiGetBook).toHaveBeenCalledWith(5, 'nextBooks');
      });

      it('leaves unchanged "read next" links alone on save', async () => {
        (apiGetBook as jest.Mock).mockResolvedValue({
          ...book,
          next_books: [{ ...book, id: 7 }],
        });
        const onSaved = jest.fn();
        renderWith(true, { bookId: 5, onSaved });
        await screen.findByAltText('Upload preview');
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        await waitFor(() => expect(onSaved).toHaveBeenCalledWith(5));
        expect(apiSetNextBooks).not.toHaveBeenCalled();
        expect(apiRemoveNextBook).not.toHaveBeenCalled();
      });

      it('stays on the form when the new cover fails to upload', async () => {
        (apiUploadBookCover as jest.Mock).mockRejectedValue(new Error('500'));
        const onSaved = jest.fn();
        renderWith(true, { bookId: 5, onSaved });
        await screen.findByAltText('Upload preview');
        fireEvent.click(screen.getByRole('button', { name: /remove image/i }));
        await pickCover();
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(
          await screen.findByText(/cover image could not be uploaded/i),
        ).toBeInTheDocument();
        expect(apiUpdateBook).toHaveBeenCalled();
        expect(onSaved).not.toHaveBeenCalled();
      });
    });
  });
});
