"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Loader2, Mail, Phone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pre-seed demo users
  useEffect(() => {
    const registeredUsersStr = localStorage.getItem("hisaab_registered_users");
    if (!registeredUsersStr) {
      const defaultUsers = [
        {
          id: "guest-user",
          email: "guest@example.com",
          password: "password",
          user_metadata: { full_name: "Guest User" }
        },
        {
          id: "guest-phone-user",
          phone: "9876543210",
          password: "password",
          user_metadata: { full_name: "Guest Phone" }
        }
      ];
      localStorage.setItem("hisaab_registered_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleTabChange = (method: 'email' | 'phone') => {
    setLoginMethod(method);
    setError(null);
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPhone('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Artificial delay for nice spinner animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const identifier = loginMethod === 'email' ? email.trim() : phone.trim();

    if (!identifier) {
      setError(loginMethod === 'email' ? 'Please enter a valid email address.' : 'Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      setIsLoading(false);
      return;
    }

    // Load registered users
    const registeredUsersStr = localStorage.getItem("hisaab_registered_users");
    const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

    // Unified flow: login if user exists, otherwise register and login immediately!
    const matchedUser = registeredUsers.find((u: any) => 
      loginMethod === 'email' 
        ? u.email?.toLowerCase() === identifier.toLowerCase() 
        : u.phone === identifier
    );

    if (matchedUser) {
      // User exists - check password
      if (matchedUser.password !== password) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Correct password - Successful login
      localStorage.setItem("hisaab_current_user", JSON.stringify(matchedUser));
      router.push('/');
    } else {
      // User does not exist - Automatically register them!
      const newUser = {
        id: crypto.randomUUID(),
        email: loginMethod === 'email' ? identifier : undefined,
        phone: loginMethod === 'phone' ? identifier : undefined,
        password: password,
        user_metadata: {
          full_name: loginMethod === 'email' ? identifier.split('@')[0] : `User ${identifier.slice(-4)}`
        }
      };

      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem("hisaab_registered_users", JSON.stringify(updatedUsers));
      
      // Auto login after registration
      localStorage.setItem("hisaab_current_user", JSON.stringify(newUser));
      router.push('/');
    }
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

          {/* Login Method Tabs */}
          <div className="flex p-1 bg-muted/50 rounded-xl mb-6 relative">
            <button
              type="button"
              onClick={() => handleTabChange('email')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg relative z-10 flex items-center justify-center gap-2 transition-colors duration-200 ${
                loginMethod === 'email' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {loginMethod === 'email' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Mail className="h-3.5 w-3.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('phone')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg relative z-10 flex items-center justify-center gap-2 transition-colors duration-200 ${
                loginMethod === 'phone' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {loginMethod === 'phone' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Phone className="h-3.5 w-3.5" />
              Phone
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 shrink-0 animate-pulse" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                {loginMethod === 'email' ? (
                  <motion.div
                    key="email-field"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      required
                      className="h-12 rounded-xl border-border bg-transparent focus-visible:ring-primary shadow-none"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone-field"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone Number</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center h-12 px-3 rounded-xl border border-border bg-muted/30 text-sm font-semibold text-muted-foreground select-none">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98765 43210"
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setError(null);
                        }}
                        required
                        className="flex-1 h-12 rounded-xl border-border bg-transparent focus-visible:ring-primary shadow-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
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
                onClick={handleToggleMode}
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
