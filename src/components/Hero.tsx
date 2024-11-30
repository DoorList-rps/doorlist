import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-doorlist-navy mb-6">
            Invest in Real Estate Deals from Top Sponsors
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
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
              className="px-8 py-3 border-2 border-doorlist-navy text-doorlist-navy rounded-full hover:bg-doorlist-navy hover:text-white transition-colors text-lg"
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