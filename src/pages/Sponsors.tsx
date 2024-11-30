import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data - replace with actual API call
const mockSponsors = [
  {
    id: "1",
    name: "Capital Ventures Group",
    description: "Leading real estate investment firm specializing in value-add opportunities",
    expertise: ["Multifamily", "Office", "Retail"],
    trackRecord: "15+ years",
    assetsUnderManagement: "$2.5B",
    logoUrl: "/placeholder.svg",
    location: "New York, NY",
  },
  {
    id: "2",
    name: "Summit Properties",
    description: "Experienced developer focused on sustainable urban development",
    expertise: ["Residential", "Mixed-Use", "Industrial"],
    trackRecord: "20+ years",
    assetsUnderManagement: "$1.8B",
    logoUrl: "/placeholder.svg",
    location: "Chicago, IL",
  },
];

const Sponsors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSponsors = mockSponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Link key={sponsor.id} to={`/sponsors/${sponsor.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center">
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="w-32 h-32 object-contain mb-4"
                  />
                  <CardTitle className="text-xl text-center">{sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{sponsor.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">{sponsor.trackRecord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">AUM</span>
                      <span className="font-medium">{sponsor.assetsUnderManagement}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {sponsor.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="bg-doorlist-navy/10 text-doorlist-navy px-3 py-1 rounded-full text-sm"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
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