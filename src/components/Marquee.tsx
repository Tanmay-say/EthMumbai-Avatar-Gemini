const MarqueeItem = () => (
  <div className="flex items-center gap-4 px-4">
    <img src="/images/logo1.png" alt="ETHMumbai" className="h-6 w-6" />
    <span className="font-display font-semibold tracking-wide">ETHMUMBAI 2026</span>
    <span className="text-primary-foreground/80">•</span>
    <span className="font-display tracking-wide">BUILD FOR THE WORLD</span>
  </div>
);

export const Marquee = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-eth-dark text-primary-foreground overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Repeat the items multiple times for seamless loop */}
        {Array.from({ length: 20 }).map((_, i) => (
          <MarqueeItem key={i} />
        ))}
      </div>
    </div>
  );
};