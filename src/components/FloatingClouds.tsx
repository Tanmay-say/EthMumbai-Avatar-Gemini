export const FloatingClouds = () => {
  return (
    <>
      {/* Left cloud */}
      <img
        src="/images/cloud.png"
        alt=""
        className="absolute left-4 top-32 w-32 md:w-48 lg:w-56 animate-float opacity-90 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Right cloud */}
      <img
        src="/images/cloud.png"
        alt=""
        className="absolute right-4 top-24 w-28 md:w-40 lg:w-48 animate-float-slow opacity-90 pointer-events-none"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />
      
      {/* Additional smaller clouds */}
      <img
        src="/images/cloud.png"
        alt=""
        className="absolute right-1/4 top-40 w-20 md:w-28 animate-float opacity-70 pointer-events-none hidden lg:block"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />
    </>
  );
};