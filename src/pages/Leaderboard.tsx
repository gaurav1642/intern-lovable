import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from "lucide-react";
import { apiService, LeaderboardEntry } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }

        const leaderboardData = await apiService.getLeaderboard();
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
        toast({
          title: "Error loading leaderboard",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 hover:bg-yellow-500">🥇 Champion</Badge>;
      case 2:
        return <Badge className="bg-gray-400 hover:bg-gray-400">🥈 Runner-up</Badge>;
      case 3:
        return <Badge className="bg-amber-600 hover:bg-amber-600">🥉 Third Place</Badge>;
      default:
        return null;
    }
  };

  const isCurrentUser = (entry: LeaderboardEntry) => {
    return currentUser && entry.id === currentUser.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);
  const totalRaised = leaderboard.reduce((sum, entry) => sum + entry.totalRaised, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-gradient flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground">
                See how you stack up against other fundraising champions
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">${totalRaised.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Raised</div>
              </CardContent>
            </Card>
            <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary">{leaderboard.length}</div>
                <div className="text-muted-foreground">Active Fundraisers</div>
              </CardContent>
            </Card>
            <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-success">
                  ${Math.round(totalRaised / leaderboard.length).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Average Raised</div>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topThree.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`text-center space-y-4 p-6 rounded-xl border-2 transition-all duration-500 ${
                      isCurrentUser(entry) 
                        ? 'border-primary bg-primary/10 animate-glow' 
                        : 'border-white/20 bg-white/5'
                    }`}
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      transform: index === 0 ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <div className="relative">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-white/20">
                        <AvatarImage src={entry.profileImage} alt={entry.name} />
                        <AvatarFallback className="text-lg font-bold">
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(entry.rank)}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg">{entry.name}</h3>
                      <p className="text-sm text-muted-foreground">{entry.department}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        ${entry.totalRaised.toLocaleString()}
                      </div>
                      {getRankBadge(entry.rank)}
                    </div>
                    
                    {isCurrentUser(entry) && (
                      <Badge variant="outline" className="animate-pulse border-primary text-primary">
                        That's You! 🎉
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Full Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`leaderboard-row flex items-center justify-between p-4 ${
                      isCurrentUser(entry) 
                        ? 'border-primary bg-primary/10 animate-glow' 
                        : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center">
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                          <span className="text-lg font-bold text-muted-foreground">
                            #{entry.rank}
                          </span>
                        )}
                      </div>
                      
                      <Avatar className="w-12 h-12 border-2 border-white/20">
                        <AvatarImage src={entry.profileImage} alt={entry.name} />
                        <AvatarFallback>
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{entry.name}</h4>
                          {isCurrentUser(entry) && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.department}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        ${entry.totalRaised.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((entry.totalRaised / totalRaised) * 100)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Leaderboard;