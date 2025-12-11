import { useState, useRef } from "react";
import { Upload, User, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TicketMachineProps {
  onGenerated: (imageUrl: string, name: string) => void;
}

export const TicketMachine = ({ onGenerated }: TicketMachineProps) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<"avatar" | "passport">("avatar");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!photo) {
      toast({
        title: "Photo required",
        description: "Please upload your photo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    console.log("===========================================");
    console.log("FRONTEND: Starting generation");
    console.log("Selected Type:", selectedType);
    console.log("Name:", name.trim());
    console.log("===========================================");

    try {
      // Convert photo to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photo);
      });
      const photoBase64 = await base64Promise;

      // Load stamp image
      let stampBase64 = "";
      try {
        const stampResponse = await fetch("/images/eth-stamp.png");
        if (stampResponse.ok) {
          const stampBlob = await stampResponse.blob();
          const stampReader = new FileReader();
          const stampPromise = new Promise<string>((resolve) => {
            stampReader.onloadend = () => resolve(stampReader.result as string);
            stampReader.readAsDataURL(stampBlob);
          });
          stampBase64 = await stampPromise;
          console.log("✓ Stamp loaded successfully");
        }
      } catch (error) {
        console.warn("Could not load stamp image:", error);
      }

      console.log("Sending to edge function with type:", selectedType);

      // Call edge function to generate avatar
      const { data, error } = await supabase.functions.invoke("generate-avatar", {
        body: { 
          name: name.trim(), 
          photo: photoBase64, 
          type: selectedType,
          stamp: stampBase64 
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.imageUrl) {
        onGenerated(data.imageUrl, name.trim());
        const typeLabel = selectedType === "passport" ? "Passport" : "Avatar";
        toast({
          title: `${typeLabel} Generated!`,
          description: `Your ETHMumbai ${typeLabel.toLowerCase()} is ready`,
        });
        console.log(`✓ ${typeLabel} generated successfully:`, data.imageUrl);
      } else {
        throw new Error("No image URL received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ticket-machine p-6 md:p-8 w-full max-w-md animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground font-medium text-sm">
          AVATAR MACHINE
        </span>
        <div className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full">
          <span className="text-xs">🎟️</span>
          <span className="text-xs font-semibold text-secondary-foreground">3 LEFT</span>
        </div>
      </div>

      {/* Type Selection Tabs */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setSelectedType("avatar")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
            selectedType === "avatar" 
              ? "bg-secondary text-secondary-foreground shadow-md" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <User className="w-4 h-4" />
          ETH-AVATAR
        </button>
        <button 
          onClick={() => setSelectedType("passport")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
            selectedType === "passport" 
              ? "bg-secondary text-secondary-foreground shadow-md" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <User className="w-4 h-4" />
          ETH-PASSPORT
        </button>
      </div>

      {/* Name Input */}
      <Input
        type="text"
        placeholder="Enter Your Name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 h-12 text-center font-medium bg-background border-2 focus:border-primary"
        disabled={isLoading}
      />

      {/* Photo Upload Area */}
      <div
        className={`dashed-border rounded-xl p-8 mb-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-muted/50 ${
          photoPreview ? "p-4" : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
        
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-primary"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Click to change photo
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-card-foreground">Upload Photo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click or drag and drop
            </p>
          </>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !name.trim() || !photo}
        className="w-full h-14 text-lg font-bold bg-muted hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            GENERATING...
          </>
        ) : (
          <>
            GENERATE TICKETS
            <Zap className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};