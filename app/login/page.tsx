"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center px-6 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hisaab
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Professional business accounting.
          </p>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-[24px] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin 
                ? 'Enter your details to access your account.' 
                : 'Start managing your finances today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-xl border-border bg-transparent focus-visible:ring-primary shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-12 rounded-xl border-border bg-transparent focus-visible:ring-primary shadow-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-full font-bold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-foreground hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
