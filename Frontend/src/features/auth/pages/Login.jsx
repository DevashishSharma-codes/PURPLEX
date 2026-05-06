import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await handleLogin(payload);
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error);
    }
  };
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  
  if(!loading && user){
    return <Navigate to="/" />
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 antialiased font-sans">
      <div className="w-full max-w-[400px]">
        <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col space-y-1.5 mb-8 text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Login</h1>
            <p className="text-sm text-zinc-500">Enter your email to access your account</p>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email</label>
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com" 
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <button type="button" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Forgot password?</button>
              </div>
              <input 
                required
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full h-10 rounded-md bg-zinc-100 text-zinc-950 font-medium text-sm transition-colors hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
            >Sign in</button>
          </form>
          

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-zinc-300 hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;