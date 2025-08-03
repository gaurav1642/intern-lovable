import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "success" | "warning";
}

const StatsCard = ({ title, value, icon, trend, variant = "default" }: StatsCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-success/50 bg-gradient-to-br from-success/10 to-success/5";
      case "warning":
        return "border-warning/50 bg-gradient-to-br from-warning/10 to-warning/5";
      default:
        return "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5";
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`stats-card ${getVariantClasses()} animate-fade-in`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                {trend.value > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={trend.value > 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-white/10 ${getIconClasses()}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;