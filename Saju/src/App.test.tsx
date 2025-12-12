import { render, screen } from '@/test/utils';
import App from './App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);

    expect(screen.getByText(/Companion Foundry/i)).toBeInTheDocument();
  });

  it('renders the development environment message', () => {
    render(<App />);

    expect(screen.getByText(/개발 환경이 준비되었습니다/i)).toBeInTheDocument();
  });

  it('renders the slogan', () => {
    render(<App />);

    expect(
      screen.getByText(/기업 업무를 끝까지 함께하는 AI 동반자를 만듭니다/i)
    ).toBeInTheDocument();
  });
});

