import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        // Check for registered users in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const foundUser = registeredUsers.find((user: any) => user.email === email);
        
        if (foundUser) {
          // Login with the registered user's data
          localStorage.setItem("user", JSON.stringify(foundUser));
          toast({
            title: `Welcome back, ${foundUser.name}!`,
            description: "Successfully logged in to your dashboard.",
          });
          navigate("/dashboard");
        } else {
          // Check if it's one of the mock users (for demo purposes)
          const mockUsers = [
            { id: "1", name: "Alex Chen", email: "alex.chen@company.com", referralCode: "AC2024X7", totalRaised: 1250 },
            { id: "2", name: "Sarah Johnson", email: "sarah.j@company.com", referralCode: "SJ2024Y9", totalRaised: 2840 },
            { id: "3", name: "Michael Rodriguez", email: "m.rodriguez@company.com", referralCode: "MR2024Z3", totalRaised: 3150 }
          ];
          
          const mockUser = mockUsers.find(user => user.email === email);
          if (mockUser) {
            localStorage.setItem("user", JSON.stringify(mockUser));
            toast({
              title: `Welcome back, ${mockUser.name}!`,
              description: "Successfully logged in to your dashboard.",
            });
            navigate("/dashboard");
          } else {
            toast({
              title: "Invalid credentials",
              description: "No account found with this email address.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg">
      <Card className="w-full max-w-md glass-card animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 animate-float">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your intern dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-card border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass-card border-white/20 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              variant="gradient" 
              size="xl" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;