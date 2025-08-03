import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReferralCodeCardProps {
  referralCode: string;
  shareUrl?: string;
}

const ReferralCodeCard = ({ referralCode, shareUrl = "https://donateapp.com/ref/" }: ReferralCodeCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareUrl}${referralCode}`);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Your referral link has been copied.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join me in making a difference!",
      text: "Use my referral code to join our donation campaign",
      url: `${shareUrl}${referralCode}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="glass-card border-primary/30 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Your Referral Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="referral-code text-center text-primary">
          {referralCode}
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Share this code with friends to earn rewards for successful referrals!
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1 glass-card border-white/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button 
            variant="gradient" 
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeCard;