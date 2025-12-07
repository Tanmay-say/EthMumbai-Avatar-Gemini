import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Avatar {
  id: string;
  name: string;
  generated_image_url: string;
}

export const GalleryPreview = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data } = await supabase
        .from("avatars")
        .select("id, name, generated_image_url")
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (data) {
        setAvatars(data.filter(a => a.generated_image_url));
      }
    };

    fetchAvatars();
  }, []);

  if (avatars.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary-foreground font-display font-bold text-lg">
          Recent Avatars
        </h3>
        <Link
          to="/gallery"
          className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="aspect-square rounded-xl overflow-hidden bg-card/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={avatar.generated_image_url}
              alt={`${avatar.name}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};