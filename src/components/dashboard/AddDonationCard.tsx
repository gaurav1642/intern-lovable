import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddDonationCardProps {
  onDonationAdded: (amount: number) => void;
  currentTotal: number;
}

const AddDonationCard = ({ onDonationAdded, currentTotal }: AddDonationCardProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = parseFloat(amount);
    
    if (!donationAmount || donationAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onDonationAdded(donationAmount);
      setAmount("");
      setIsLoading(false);
      
      toast({
        title: "Donation added successfully! 🎉",
        description: `$${donationAmount.toFixed(2)} has been added to your total.`,
      });
    }, 800);
  };

  return (
    <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-500/20 rounded-full">
            <PlusCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Add Donation</CardTitle>
            <CardDescription>Record a new donation received</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddDonation} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="donation-amount">Donation Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="donation-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="glass-card border-white/20 pl-10"
                required
              />
            </div>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Total:</span>
              <span className="font-semibold">${currentTotal.toFixed(2)}</span>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">New Total:</span>
                <span className="font-semibold text-green-400">
                  ${(currentTotal + parseFloat(amount)).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="success" 
            className="w-full"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Add Donation
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDonationCard;