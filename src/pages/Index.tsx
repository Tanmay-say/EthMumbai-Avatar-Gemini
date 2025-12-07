import { useState } from "react";
import { Marquee } from "@/components/Marquee";
import { FloatingClouds } from "@/components/FloatingClouds";
import { Skyline } from "@/components/Skyline";
import { TicketMachine } from "@/components/TicketMachine";
import { GeneratedAvatar } from "@/components/GeneratedAvatar";
import { GalleryPreview } from "@/components/GalleryPreview";

const Index = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const handleGenerated = (imageUrl: string, name: string) => {
    setGeneratedImage(imageUrl);
    setUserName(name);
  };

  const handleBack = () => {
    setGeneratedImage(null);
    setUserName("");
  };

  return (
    <div className="min-h-screen eth-gradient relative overflow-hidden">
      {/* Marquee Banner */}
      <Marquee />

      {/* Floating Clouds */}
      <FloatingClouds />

      {/* City Skyline */}
      <Skyline />

      {/* Main Content */}
      <div className="relative z-20 pt-20 pb-32 px-4 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="absolute top-16 left-4 md:left-8 flex items-center gap-2 mt-4">
          <img src="/images/logo.png" alt="ETHMumbai" className="h-10 md:h-12" />
          <span className="text-primary-foreground font-display font-bold text-lg md:text-xl tracking-tight">
            ETHMUMBAI
          </span>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-32 right-8 hidden lg:block">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-secondary" />
            <div className="w-12 h-12 rounded-full bg-accent absolute -bottom-2 -right-4" />
          </div>
        </div>

        {/* Main Layout */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm">🎟️</span>
              <span className="text-primary-foreground font-medium text-sm">
                OFFICIAL TICKET BOOTH
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-4">
              GET YOUR<br />
              <span className="text-secondary">AVATAR</span>
            </h1>

            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-md mx-auto lg:mx-0 mb-8">
              Board the bus to Web3! Upload your photo to mint your personalized ETHMumbai Avatar.
            </p>

            {/* Bus Image */}
            <div className="relative w-64 md:w-80 mx-auto lg:mx-0">
              <img
                src="/images/bus.png"
                alt="Mumbai Double Decker Bus"
                className="w-full h-auto animate-float"
              />
            </div>
          </div>

          {/* Right Content - Ticket Machine or Generated Avatar */}
          <div className="w-full max-w-md">
            {generatedImage ? (
              <GeneratedAvatar
                imageUrl={generatedImage}
                name={userName}
                onBack={handleBack}
              />
            ) : (
              <TicketMachine onGenerated={handleGenerated} />
            )}
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="mt-12 w-full max-w-6xl flex justify-end">
          <GalleryPreview />
        </div>
      </div>
    </div>
  );
};

export default Index;