import { useState } from "react";
import { Marquee } from "@/components/Marquee";
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

      {/* City Skyline */}
      <Skyline />

      {/* Main Content */}
      <div className="relative z-20 pt-20 pb-32 px-4 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="absolute top-16 left-4 md:left-8 mt-4">
          <img src="/images/logo.png" alt="ETHMumbai" className="h-16 md:h-20 w-auto object-contain" />
        </div>

        {/* Connect Wallet Button - Top Right */}
        <div className="absolute top-16 right-4 md:right-8 mt-4">
          <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Connect Wallet
          </button>
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
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-primary-foreground leading-tight mb-6 tracking-tight uppercase">
              GET YOUR<br />
              <span className="text-secondary font-black">AVATAR</span>
            </h1>

            <p className="text-primary-foreground/95 text-lg md:text-xl max-w-md mx-auto lg:mx-0 mb-8 font-medium">
              Board the bus to Web3! Upload your photo to mint your personalized ETHMumbai Avatar.
            </p>
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

        {/* Gallery Preview - Bottom Left */}
        <div className="absolute bottom-8 left-4 md:left-8 z-30">
          <GalleryPreview />
        </div>
      </div>
    </div>
  );
};

export default Index;