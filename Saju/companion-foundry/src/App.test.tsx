import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// App already includes its own Router, so we render it without wrapper
const renderApp = () => {
  return render(<App />);
};

describe('App', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders the main heading', () => {
    renderApp();
    expect(screen.getByText(/Companion Foundry/i)).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderApp();
    expect(
      screen.getByText(/기업 업무를 끝까지 함께하는 AI 동반자를 만듭니다/i)
    ).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    renderApp();
    expect(screen.getByText(/목\(木\) - 기획/i)).toBeInTheDocument();
    expect(screen.getByText(/화\(火\) - 개발/i)).toBeInTheDocument();
    expect(screen.getByText(/수\(水\) - 품질/i)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderApp();
    expect(screen.getByText(/시작하기/i)).toBeInTheDocument();
    expect(screen.getByText(/더 알아보기/i)).toBeInTheDocument();
  });
});
