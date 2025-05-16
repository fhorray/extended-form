import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner.tsx';

let router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
);
