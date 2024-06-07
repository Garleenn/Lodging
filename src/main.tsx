import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './pages/Main/Main.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { Profile } from './pages/Profile/Profile.tsx';
import { NotFound } from './components/NotFound/NotFound.tsx';
import { Product } from './pages/Product/Product.tsx';
import { Cart } from './pages/Cart/Cart';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "user/:id",
    element: <Profile/>,
  },
  {
    path: "product/:id",
    element: <Product />,
  },
  {
    path: "favorites",
    element: <Cart />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)