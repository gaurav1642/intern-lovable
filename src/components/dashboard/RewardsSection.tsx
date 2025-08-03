import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gift, Star, Crown, Medal, Award } from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  type: "bronze" | "silver" | "gold" | "platinum";
}

const RewardsSection = ({ totalRaised }: { totalRaised: number }) => {
  const rewards: Reward[] = [
    {
      id: "1",
      title: "First Step",
      description: "Raise your first $100",
      threshold: 100,
      icon: <Medal className="w-6 h-6" />,
      unlocked: totalRaised >= 100,
      progress: Math.min((totalRaised / 100) * 100, 100),
      type: "bronze"
    },
    {
      id: "2",
      title: "Rising Star",
      description: "Reach $500 in donations",
      threshold: 500,
      icon: <Star className="w-6 h-6" />,
      unlocked: totalRaised >= 500,
      progress: Math.min((totalRaised / 500) * 100, 100),
      type: "silver"
    },
    {
      id: "3",
      title: "Fundraising Hero",
      description: "Achieve $1,000 milestone",
      threshold: 1000,
      icon: <Trophy className="w-6 h-6" />,
      unlocked: totalRaised >= 1000,
      progress: Math.min((totalRaised / 1000) * 100, 100),
      type: "gold"
    },
    {
      id: "4",
      title: "Champion",
      description: "Reach the ultimate $2,500",
      threshold: 2500,
      icon: <Crown className="w-6 h-6" />,
      unlocked: totalRaised >= 2500,
      progress: Math.min((totalRaised / 2500) * 100, 100),
      type: "platinum"
    }
  ];

  const getRewardColors = (type: string, unlocked: boolean) => {
    if (!unlocked) return "text-muted-foreground";
    
    switch (type) {
      case "bronze":
        return "text-amber-600";
      case "silver":
        return "text-gray-400";
      case "gold":
        return "text-yellow-500";
      case "platinum":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "bronze":
        return "secondary";
      case "silver":
        return "outline";
      case "gold":
        return "default";
      case "platinum":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Rewards & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rewards.map((reward, index) => (
          <div 
            key={reward.id} 
            className={`p-4 rounded-lg border transition-all duration-500 ${
              reward.unlocked 
                ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 animate-glow' 
                : 'bg-muted/20 border-muted/30'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${reward.unlocked ? 'bg-primary/20' : 'bg-muted/20'}`}>
                  <div className={getRewardColors(reward.type, reward.unlocked)}>
                    {reward.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">{reward.title}</h4>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={getBadgeVariant(reward.type)}
                  className={`capitalize ${reward.unlocked ? 'animate-pulse' : ''}`}
                >
                  {reward.type}
                </Badge>
                {reward.unlocked && (
                  <Award className="w-5 h-5 text-success animate-bounce" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">${totalRaised} / ${reward.threshold}</span>
              </div>
              <Progress 
                value={reward.progress} 
                className={`h-2 ${reward.unlocked ? 'animate-pulse' : ''}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RewardsSection;