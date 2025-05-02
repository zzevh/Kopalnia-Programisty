import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './componentsREACTBITS/Footer.jsx'
import AllProducts from './allproducts.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Legals from './pages/Legals';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/legals" element={<Legals />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
