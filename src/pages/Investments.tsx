import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data - replace with actual API call
const mockInvestments = [
  {
    id: "1",
    title: "Urban Residential Complex",
    description: "Modern residential development in prime urban location",
    type: "Multifamily",
    location: "Los Angeles, CA",
    minInvestment: 25000,
    targetReturn: "15-18%",
    status: "Open",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Industrial Warehouse Portfolio",
    description: "Strategic industrial assets in key logistics locations",
    type: "Industrial",
    location: "Dallas, TX",
    minInvestment: 50000,
    targetReturn: "12-15%",
    status: "Open",
    imageUrl: "/placeholder.svg",
  },
];

const Investments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const filteredInvestments = mockInvestments.filter((investment) => {
    const matchesSearch = investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || investment.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = Array.from(new Set(mockInvestments.map((i) => i.type)));

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
          <div className="flex gap-2">
            <Button
              variant={selectedType === "" ? "default" : "outline"}
              onClick={() => setSelectedType("")}
              className="whitespace-nowrap"
            >
              All Types
            </Button>
            {types.map((type) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((investment) => (
            <Link key={investment.id} to={`/investments/${investment.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <img
                  src={investment.imageUrl}
                  alt={investment.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{investment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{investment.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minimum</span>
                      <span className="font-medium">${investment.minInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Return</span>
                      <span className="font-medium">{investment.targetReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium">{investment.location}</span>
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

export default Investments;