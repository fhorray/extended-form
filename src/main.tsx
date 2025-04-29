import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router';
import Form from './Form.tsx';

let router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/form',
    Component: Form,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
