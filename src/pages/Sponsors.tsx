import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Sponsors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sponsors, isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Sponsors')
        .select('*')
        .eq('Approved?', 'true');
      
      if (error) throw error;
      return data as Tables<'Sponsors'>[];
    }
  });

  const filteredSponsors = sponsors?.filter((sponsor) =>
    sponsor.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Our Sponsors</h1>
        
        <div className="relative max-w-md mb-8">
          <Input
            type="text"
            placeholder="Search sponsors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor) => (
            <Link key={sponsor.Primary_Key} to={`/sponsors/${sponsor.Primary_Key}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center">
                  <img
                    src={sponsor.Logo || '/placeholder.svg'}
                    alt={sponsor.Name || 'Sponsor logo'}
                    className="w-32 h-32 object-contain mb-4"
                  />
                  <CardTitle className="text-xl text-center">{sponsor.Name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{sponsor["Short Description"] || sponsor.Description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">{sponsor["Year Founded"] ? `Since ${sponsor["Year Founded"]}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">AUM</span>
                      <span className="font-medium">{sponsor["Assets Under Management"] || 'N/A'}</span>
                    </div>
                    {sponsor["Property Type"] && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {sponsor["Property Type"].split(',').map((type) => (
                          <span
                            key={type}
                            className="bg-doorlist-navy/10 text-doorlist-navy px-3 py-1 rounded-full text-sm"
                          >
                            {type.trim()}
                          </span>
                        ))}
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

export default Sponsors;