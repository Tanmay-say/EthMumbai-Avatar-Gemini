import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/Marquee";
import { useToast } from "@/hooks/use-toast";

interface Avatar {
  id: string;
  name: string;
  generated_image_url: string;
  created_at: string;
}

const Gallery = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data, error } = await supabase
        .from("avatars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching avatars:", error);
      } else {
        setAvatars(data?.filter((a) => a.generated_image_url) || []);
      }
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  const handleDownload = async (imageUrl: string, name: string) => {
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
      toast({ title: "Downloaded!", description: "Avatar has been saved" });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen eth-gradient">
      <Marquee />

      <div className="pt-20 pb-16 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <img src="/images/logo.png" alt="ETHMumbai" className="h-12" />
            <div>
              <h1 className="font-display text-4xl font-bold text-primary-foreground">
                Avatar Gallery
              </h1>
              <p className="text-primary-foreground/80">
                {avatars.length} avatars created
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-primary-foreground/10 animate-pulse"
                />
              ))}
            </div>
          ) : avatars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-primary-foreground/80 text-lg mb-4">
                No avatars created yet
              </p>
              <Link to="/">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Create the first one!
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src={avatar.generated_image_url}
                    alt={`${avatar.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold truncate">{avatar.name}</p>
                      <p className="text-white/70 text-sm">
                        {new Date(avatar.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDownload(avatar.generated_image_url, avatar.name)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;