import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const InvestmentDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const investment = {
    id: "1",
    title: "Urban Residential Complex",
    description: "Modern residential development in prime urban location with excellent amenities and strong rental demand. This investment opportunity offers a compelling blend of stable cash flow and appreciation potential.",
    type: "Multifamily",
    location: "Los Angeles, CA",
    minInvestment: 25000,
    targetReturn: "15-18%",
    status: "Open",
    imageUrl: "/placeholder.svg",
    highlights: [
      "Prime location in growing market",
      "Strong rental demand",
      "Professional property management",
      "Value-add opportunity",
    ],
    details: {
      propertyType: "Class A Multifamily",
      units: "200",
      yearBuilt: "2020",
      occupancy: "95%",
    },
  };

  const handleContactClick = () => {
    toast({
      title: "Contact Request Sent",
      description: "Thank you for your interest. Our team will contact you shortly.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={investment.imageUrl}
              alt={investment.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{investment.title}</h1>
            <p className="text-gray-600 mb-6">{investment.description}</p>
            
            <Card className="mb-6">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-gray-500">Minimum Investment</p>
                  <p className="text-xl font-semibold">${investment.minInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Target Return</p>
                  <p className="text-xl font-semibold">{investment.targetReturn}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-xl font-semibold">{investment.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="text-xl font-semibold">{investment.status}</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleContactClick}
              size="lg"
              className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
            >
              Contact Us About This Investment
            </Button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Investment Highlights</h2>
            <ul className="space-y-2">
              {investment.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-doorlist-salmon rounded-full" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Property Details</h2>
            <Card>
              <CardContent className="p-6">
                {Object.entries(investment.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvestmentDetail;