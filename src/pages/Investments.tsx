import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Investments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      console.log('Starting investments fetch...');
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          sponsors (
            name,
            logo_url
          )
        `);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Investments found:', data?.length);
      return data as (Tables<'investments'> & { sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> })[];
    }
  });

  const types = investments 
    ? Array.from(new Set(investments.map(i => i.property_type).filter(Boolean)))
    : [];

  const filteredInvestments = investments?.filter((investment) => {
    const matchesSearch = (
      investment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location_state?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = !selectedType || investment.property_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Opportunities</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === "" ? "default" : "outline"}
              onClick={() => setSelectedType("")}
              className="whitespace-nowrap"
            >
              All Types
            </Button>
            {types.map((type) => type && (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="whitespace-nowrap"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600">Error loading investments</h3>
            <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && (!filteredInvestments || filteredInvestments.length === 0) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No investments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments?.map((investment) => (
            <Link key={investment.id} to={`/investments/${investment.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
                <img
                  src={investment.hero_image_url || '/placeholder.svg'}
                  alt={investment.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <CardHeader>
                  <CardTitle 
                    className={`text-xl ${investment.name.length < 35 ? 'mb-2' : 'mb-0'}`}
                  >
                    {investment.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-gray-600 mb-6">{investment.short_description || investment.description}</p>
                  </div>
                  <div className="mt-auto space-y-2">
                    {investment.minimum_investment && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Minimum</span>
                        <span className="font-medium">${investment.minimum_investment.toLocaleString()}</span>
                      </div>
                    )}
                    {investment.target_return && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Return</span>
                        <span className="font-medium">{investment.target_return}</span>
                      </div>
                    )}
                    {(investment.location_city || investment.location_state) && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">
                          {[investment.location_city, investment.location_state]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investments;