import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import axios from 'axios'
axios.defaults.withCredentials = true;

import {
  createBrowserRouter,
  RouterProvider
  } from "react-router-dom";
  
import { App } from './pages/Main/Main.tsx'
import { Profile } from './pages/Profile/Profile.tsx';
import { NotFound } from './components/NotFound/NotFound.tsx';
import { Product } from './pages/Product/Product.tsx';
import { Cart } from './pages/Cart/Cart';
import { Register } from './pages/EnterPage/Register.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Login } from './pages/EnterPage/Login.tsx';

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
  {
    path: "login",
    element: <Login />
  },
  {
    path: "register",
    element: <Register />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)