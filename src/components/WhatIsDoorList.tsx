import { Link } from "react-router-dom";
import { Search, Home } from "lucide-react";

const WhatIsDoorList = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-doorlist-navy mb-8">What is DoorList?</h2>
            <p className="text-lg text-gray-700 mb-12">
              DoorList's mission is to democratize passive real estate investing by connecting investors with opportunities that were previously hard to discover. We built this database from years of our own research.
            </p>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Search className="w-8 h-8 text-doorlist-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-3">10+ Investment Opportunities</h3>
                  <p className="text-gray-600">
                    Use our marketplace to compare different real estate investments, finding the right fit for you and your goals. We're always adding more.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Home className="w-8 h-8 text-doorlist-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-3">220+ Sponsors</h3>
                  <p className="text-gray-600">
                    We have carefully researched, reviewed, and approved Sponsors who make passive investing in commercial real estate easy. Use DoorList to learn more about these companies.
                  </p>
                </div>
              </div>
            </div>

            <Link 
              to="/investments"
              className="inline-flex items-center mt-12 text-lg font-semibold text-doorlist-navy hover:text-doorlist-salmon transition-colors"
            >
              EXPLORE THE MARKETPLACE
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div>
            <img
              src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpg"
              alt="DoorList Investment List"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsDoorList;