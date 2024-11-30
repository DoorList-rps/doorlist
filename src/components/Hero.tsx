import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-doorlist-navy overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src="/lovable-uploads/57591e9e-a8d6-4180-b51a-6b8bdabb29fb.png" 
            alt="DoorList Logo" 
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Invest in Real Estate Deals from Top Sponsors
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            DoorList connects investors with institutional-quality real estate deals from experienced sponsors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/investments"
              className="px-8 py-3 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors text-lg"
            >
              Browse Deals
            </Link>
            <Link
              to="/sponsors"
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-doorlist-navy transition-colors text-lg"
            >
              View Sponsors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;