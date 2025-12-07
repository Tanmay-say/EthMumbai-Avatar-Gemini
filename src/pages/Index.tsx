import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Marquee } from "@/components/Marquee";
import { Skyline } from "@/components/Skyline";
import { TicketMachine } from "@/components/TicketMachine";
import { GeneratedAvatar } from "@/components/GeneratedAvatar";
import { GalleryPreview } from "@/components/GalleryPreview";

const Index = () => {
  const navigate = useNavigate();
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
      <div className="relative z-20 pt-24 pb-48 px-4 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="absolute top-20 left-4 md:left-8">
          <img src="/images/logo.png" alt="ETHMumbai" className="h-16 md:h-20 w-auto object-contain" />
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-20 right-4 md:right-8 flex items-center gap-3">
          <button
            onClick={() => navigate("/gallery")}
            className="bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
            </svg>
            Recent
          </button>
          <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Connect Wallet
          </button>
        </div>

        {/* Main Layout */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in mt-16 md:mt-20">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-primary-foreground leading-tight mb-8 tracking-tight uppercase">
              GET YOUR<br />
              <span className="text-secondary font-black">AVATAR PASS</span>
            </h1>

            <p className="text-primary-foreground/95 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-12 font-medium">
              Board the bus to Web3! Upload your photo to mint your personalized ETHMumbai Avatar.
            </p>

            {/* Sample Cards - Overlapping with hover space */}
            <div className="relative flex items-center justify-center lg:justify-start mt-2 h-80 md:h-96">
              {/* Sample Card 1 */}
              <div className="group absolute left-12 md:left-16 z-0 hover:z-50 transition-all duration-300">
                <div className="w-52 md:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl transform -rotate-14 translate-x-2 translate-y-4 transition-all duration-300 ease-out group-hover:-rotate-8 group-hover:-translate-y-6 group-hover:scale-110 cursor-pointer border-4 border-white">
                  <img
                    src="/images/sample1.png"
                    alt="Sample Avatar 1"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Sample Card 2 */}
              <div className="group absolute right-12 md:right-16 z-10 hover:z-50 transition-all duration-300">
                <div className="w-52 md:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl transform rotate-14 -translate-x-2 translate-y-2 transition-all duration-300 ease-out group-hover:rotate-8 group-hover:-translate-y-8 group-hover:scale-112 cursor-pointer border-4 border-white">
                  <img
                    src="/images/sample2.png"
                    alt="Sample Avatar 2"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
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

      </div>
    </div>
  );
};

export default Index;