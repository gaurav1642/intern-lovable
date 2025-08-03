import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import ReferralCodeCard from "@/components/dashboard/ReferralCodeCard";
import RewardsSection from "@/components/dashboard/RewardsSection";
import AddDonationCard from "@/components/dashboard/AddDonationCard";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DollarSign, Users, Trophy, TrendingUp, LogOut, RefreshCw } from "lucide-react";
import { apiService, User } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const [userDetails, userStats] = await Promise.all([
          apiService.getCurrentUser(parsedUser.id),
          apiService.getUserStats(parsedUser.id)
        ]);

        setUser({ ...parsedUser, ...userDetails });
        setStats(userStats);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading data",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const [userDetails, userStats] = await Promise.all([
        apiService.getCurrentUser(user.id),
        apiService.getUserStats(user.id)
      ]);

      setUser({ ...user, ...userDetails });
      setStats(userStats);
      toast({
        title: "Data refreshed",
        description: "Your dashboard has been updated with the latest information.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/login");
  };

  const handleDonationAdded = async (amount: number) => {
    if (!user) return;
    
    try {
      // Update user data locally and in localStorage
      const updatedUser = { ...user, totalRaised: user.totalRaised + amount };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update registered users array if exists
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = updatedUser;
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      }
      
      // Refresh stats to get updated rank
      const userStats = await apiService.getUserStats(user.id);
      setStats(userStats);
      
    } catch (error) {
      console.error("Error updating donation:", error);
      toast({
        title: "Error updating donation",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
                  Welcome back, {user?.name}! 
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Track your impact and unlock amazing rewards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="glass-card border-white/20 flex-1 sm:flex-none"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="glass-card border-white/20 flex-1 sm:flex-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Raised"
              value={`$${user?.totalRaised?.toLocaleString() || 0}`}
              icon={<DollarSign className="w-6 h-6" />}
              trend={{ value: stats?.monthlyGrowth || 0, label: "this month" }}
              variant="success"
            />
            <StatsCard
              title="Your Rank"
              value={`#${stats?.rank || 0}`}
              icon={<Trophy className="w-6 h-6" />}
              trend={{ value: 5, label: "positions up" }}
              variant="warning"
            />
            <StatsCard
              title="Referrals"
              value={stats?.referrals || 0}
              icon={<Users className="w-6 h-6" />}
              trend={{ value: 12, label: "new this week" }}
            />
            <StatsCard
              title="Percentile"
              value={`${stats?.percentileRank || 0}%`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: 3, label: "improvement" }}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Quick Actions */}
              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="gradient" size="lg" className="h-auto py-4 flex-col gap-2">
                    <DollarSign className="w-6 h-6" />
                    <span>Start New Campaign</span>
                    <span className="text-xs opacity-80">Create a fundraising campaign</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2 glass-card border-white/20">
                    <Users className="w-6 h-6" />
                    <span>Invite Friends</span>
                    <span className="text-xs opacity-80">Expand your network</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Rewards Section */}
              <RewardsSection totalRaised={user?.totalRaised || 0} />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Add Donation Card */}
              <AddDonationCard 
                onDonationAdded={handleDonationAdded}
                currentTotal={user?.totalRaised || 0}
              />
              
              {/* Referral Code */}
              <ReferralCodeCard referralCode={user?.referralCode || ""} />

              {/* Recent Activity */}
              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: "Donation received", amount: "$25", time: "2 hours ago" },
                    { action: "New referral", amount: "+1", time: "1 day ago" },
                    { action: "Achievement unlocked", amount: "🏆", time: "3 days ago" },
                    { action: "Donation received", amount: "$50", time: "1 week ago" },
                  ].map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <div className="font-bold text-primary">{activity.amount}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;