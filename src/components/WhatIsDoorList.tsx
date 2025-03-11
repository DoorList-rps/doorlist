import { Link } from "react-router-dom";
import { Search, Home, Calculator, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const WhatIsDoorList = () => {
  const {
    data: counts
  } = useQuery({
    queryKey: ['counts'],
    queryFn: async () => {
      const {
        count: investmentCount,
        error: investmentError
      } = await supabase.from('investments').select('*', {
        count: 'exact',
        head: true
      }).eq('approved', true);
      if (investmentError) throw investmentError;
      const {
        count: sponsorCount,
        error: sponsorError
      } = await supabase.from('sponsors').select('*', {
        count: 'exact',
        head: true
      }).eq('approved', true);
      if (sponsorError) throw sponsorError;
      return {
        investments: investmentCount || 0,
        sponsors: sponsorCount || 0
      };
    }
  });
  return <div className="bg-white py-[48px]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-doorlist-navy mb-8">What is DoorList?</h2>
            <p className="text-lg text-gray-700 mb-12">
              DoorList's mission is to democratize passive real estate investing by connecting investors with opportunities that were previously hard to discover. Learn more about our story on our <Link to="/about" className="text-doorlist-salmon hover:underline">About page</Link>. We built this database from years of our own research.
            </p>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Search className="w-8 h-8 text-doorlist-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-3">
                    <Link to="/investments" className="hover:text-doorlist-salmon transition-colors">
                      {counts?.investments || '0'}+ Investment Opportunities
                    </Link>
                  </h3>
                  <p className="text-gray-600">
                    Use our marketplace to compare different real estate investments, finding the right fit for you and your goals. We're always adding more. <Link to="/calculator" className="text-doorlist-salmon hover:underline">Try our investment calculator</Link> to analyze potential returns.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Home className="w-8 h-8 text-doorlist-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-3">
                    <Link to="/sponsors" className="hover:text-doorlist-salmon transition-colors">
                      {counts?.sponsors || '0'}+ Sponsors
                    </Link>
                  </h3>
                  <p className="text-gray-600">
                    We have carefully researched, reviewed, and approved Sponsors who make passive investing in commercial real estate easy. Use DoorList to learn more about these companies. Have questions? <Link to="/contact" className="text-doorlist-salmon hover:underline">Contact us</Link> for more information.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-doorlist-navy" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-3">
                    <Link to="/education" className="hover:text-doorlist-salmon transition-colors">
                      Educational Resources
                    </Link>
                  </h3>
                  <p className="text-gray-600">
                    New to real estate investing? Check out our comprehensive <Link to="/education" className="text-doorlist-salmon hover:underline">education center</Link> and <Link to="/faq" className="text-doorlist-salmon hover:underline">FAQ page</Link> to learn more about passive real estate investing.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/investments" className="inline-flex items-center mt-12 text-lg font-semibold text-doorlist-navy hover:text-doorlist-salmon transition-colors">
              EXPLORE THE MARKETPLACE
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div>
            <img src="/lovable-uploads/bd499f14-7353-49ac-939d-0da5c2df4ded.png" alt="DoorList Investment Opportunities" className="w-full rounded-lg shadow-xl" />
          </div>
        </div>
      </div>
    </div>;
};
export default WhatIsDoorList;