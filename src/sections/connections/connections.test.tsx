import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionsPage } from './connections';

const renderPage = (canEdit: boolean) => {
  const client = new QueryClient();
  const ui = (edit: boolean) => (
    <QueryClientProvider client={client}>
      <ConnectionsPage books={[]} canEdit={edit} onBookSelect={() => {}} />
    </QueryClientProvider>
  );
  const result = render(ui(canEdit));

  return {
    ...result,
    rerenderWith: (edit: boolean) => result.rerender(ui(edit)),
  };
};

describe('ConnectionsPage editing', () => {
  it('hides the edit button from visitors', () => {
    renderPage(false);

    expect(
      screen.queryByRole('button', { name: /edit connections/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the edit button to admins', () => {
    renderPage(true);

    expect(
      screen.getByRole('button', { name: /edit connections/i }),
    ).toBeInTheDocument();
  });

  it('leaves edit mode when the admin signs out', async () => {
    const { rerenderWith } = renderPage(true);

    await userEvent.click(
      screen.getByRole('button', { name: /edit connections/i }),
    );
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();

    rerenderWith(false);
    rerenderWith(true);

    expect(
      screen.getByRole('button', { name: /edit connections/i }),
    ).toBeInTheDocument();
  });
});
