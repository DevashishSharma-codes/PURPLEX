import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Replace with your registration logic (e.g., Firebase, Supabase, or custom backend)
    console.log("Registering user:", formData);

    setTimeout(() => {
      setIsLoading(false);
      alert("Account created!");
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-[420px]">
        <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col space-y-1.5 mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Create account</h1>
            <p className="text-sm text-zinc-500">Join the platform to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-400">Username</label>
              <input 
                required
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                placeholder="username" 
                className="h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-400">Email</label>
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com" 
                className="h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <input 
                required
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full h-10 rounded-md bg-zinc-100 text-zinc-950 font-medium text-sm transition-colors hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-zinc-300">Terms</a> and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-zinc-300">Privacy Policy</a>.
          </p>
        </div>
        
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <a href="/login" className="text-zinc-300 hover:underline underline-offset-4">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;