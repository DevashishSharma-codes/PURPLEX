import { createBrowserRouter } from 'react-router-dom';
import Login from '@/features/auth/pages/Login.jsx';
import Register from '@/features/auth/pages/Register.jsx';
// import Protected from '@/features/auth/components/Protected';
import Landing from '@/features/chat/pages/Landing.jsx';
import Dashboard from '@/features/chat/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: "/",
    element: 

     <Dashboard></Dashboard>

  },
  {
    path: "/landing",
    element : <Landing />
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