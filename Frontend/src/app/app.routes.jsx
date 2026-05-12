import { createBrowserRouter } from 'react-router-dom';
import Login from '@/features/auth/pages/Login.jsx';
import Register from '@/features/auth/pages/Register.jsx';
import Protected from '@/features/auth/components/Protected';
import Landing from '@/features/chat/pages/Landing.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: 

     <Landing></Landing>

  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);