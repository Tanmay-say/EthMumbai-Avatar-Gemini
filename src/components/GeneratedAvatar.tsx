import { Download, Share2, Twitter, Linkedin, Link2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GeneratedAvatarProps {
  imageUrl: string;
  name: string;
  onBack: () => void;
}

export const GeneratedAvatar = ({ imageUrl, name, onBack }: GeneratedAvatarProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ethmumbai-avatar-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({ title: "Downloaded!", description: "Your avatar has been saved" });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: "twitter" | "linkedin" | "copy") => {
    const shareText = `Just got my ETHMumbai 2026 avatar! 🚌✨ Board the bus to Web3! #ETHMumbai #Web3 #Mumbai`;
    const shareUrl = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({ title: "Link copied!", description: "Share it with your friends" });
        } catch {
          toast({
            title: "Copy failed",
            description: "Please copy the URL manually",
            variant: "destructive",
          });
        }
        break;
    }
  };

  return (
    <div className="ticket-machine p-6 md:p-8 w-full max-w-md animate-scale-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Create Another</span>
      </button>

      {/* Generated Image */}
      <div className="rounded-xl overflow-hidden mb-6 shadow-lg">
        <img
          src={imageUrl}
          alt={`${name}'s ETHMumbai Avatar`}
          className="w-full h-auto"
        />
      </div>

      {/* Name Display */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-bold text-card-foreground">
          {name}'s Avatar
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your ETHMumbai 2026 ticket is ready!
        </p>
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        className="w-full h-12 mb-4 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Download className="w-5 h-5 mr-2" />
        DOWNLOAD AVATAR
      </Button>

      {/* Share Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleShare("twitter")}
          className="h-12 hover:bg-accent hover:text-accent-foreground"
        >
          <Twitter className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare("linkedin")}
          className="h-12 hover:bg-accent hover:text-accent-foreground"
        >
          <Linkedin className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare("copy")}
          className="h-12 hover:bg-accent hover:text-accent-foreground"
        >
          <Link2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};