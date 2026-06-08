'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090b] p-6 selection:bg-purple-500/30">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
            <Store className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            mera <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">hisaab</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">
            Modern Business Accounting
          </p>
        </div>

        <Card className="border-white/10 bg-[#09090b]/40 backdrop-blur-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              {isLogin 
                ? 'Enter your credentials to access your dukaan hisaab.' 
                : 'Start managing your business finances with ease.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/30 focus:border-purple-500/50 focus:ring-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" name="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/30 focus:border-purple-500/50 focus:ring-purple-500/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-white shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-blue-700 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#09090b] px-2 text-muted-foreground/40">Or continue with</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground/60">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-muted-foreground/40 uppercase tracking-widest">
          <span>Secure</span>
          <span>•</span>
          <span>Encrypted</span>
          <span>•</span>
          <span>Private</span>
        </div>
      </motion.div>
    </div>
  );
}
