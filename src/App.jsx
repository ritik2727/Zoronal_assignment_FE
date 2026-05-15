import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CompanyDetailPage from './pages/CompanyDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/company/:id" element={<CompanyDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
