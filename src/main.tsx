import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element introuvable. Vérifie ton index.html (id='root').");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);