import { useState } from 'react';
import StockReviewApp from './components/StockReviewApp';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

export type Page = 'home' | 'login' | 'register';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }

  return <StockReviewApp onNavigate={handleNavigate} />;
}