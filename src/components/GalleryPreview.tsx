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
        .limit(8);
      
      if (data) {
        setAvatars(data.filter(a => a.generated_image_url));
      }
    };

    fetchAvatars();
  }, []);

  if (avatars.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-primary-foreground font-display font-bold text-2xl md:text-3xl">
          Recent Avatars
        </h3>
        <Link
          to="/gallery"
          className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground text-base md:text-lg font-bold transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20"
        >
          View All
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="aspect-square rounded-2xl overflow-hidden bg-card/20 backdrop-blur-sm hover:scale-110 hover:shadow-2xl transition-all cursor-pointer border-2 border-white/20"
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