import React from 'react'
import Register from '@/features/auth/pages/Register.jsx'
import {RouterProvider} from 'react-router'
import {router} from './app.routes.jsx'
import { useAuth } from '@/features/auth/hook/useAuth.js'
import { useEffect } from 'react'

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
   
  <>
    <RouterProvider router={router}/>
  </>
  )
}

export default App