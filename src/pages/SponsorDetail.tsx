import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const SponsorDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const sponsor = {
    id: "1",
    name: "Capital Ventures Group",
    description: "Leading real estate investment firm specializing in value-add opportunities across multiple asset classes. Our team brings decades of experience in identifying, acquiring, and managing high-performing real estate investments.",
    expertise: ["Multifamily", "Office", "Retail"],
    trackRecord: "15+ years",
    assetsUnderManagement: "$2.5B",
    logoUrl: "/placeholder.svg",
    location: "New York, NY",
    team: [
      {
        name: "John Smith",
        title: "Managing Partner",
        experience: "25+ years",
      },
      {
        name: "Sarah Johnson",
        title: "Head of Acquisitions",
        experience: "18+ years",
      },
    ],
    stats: {
      totalDeals: "50+",
      averageIRR: "18%",
      totalInvestors: "1,000+",
      successfulExits: "25+",
    },
  };

  const handleContactClick = () => {
    toast({
      title: "Contact Request Sent",
      description: "Thank you for your interest. Our team will contact you shortly about this sponsor.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={sponsor.logoUrl}
              alt={sponsor.name}
              className="w-full max-h-[300px] object-contain rounded-lg bg-gray-50 p-8"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{sponsor.name}</h1>
            <p className="text-gray-600 mb-6">{sponsor.description}</p>
            
            <Card className="mb-6">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="text-xl font-semibold">{sponsor.trackRecord}</p>
                </div>
                <div>
                  <p className="text-gray-500">Assets Under Management</p>
                  <p className="text-xl font-semibold">{sponsor.assetsUnderManagement}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-xl font-semibold">{sponsor.location}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 mb-6">
              {sponsor.expertise.map((exp) => (
                <span
                  key={exp}
                  className="bg-doorlist-navy/10 text-doorlist-navy px-4 py-2 rounded-full"
                >
                  {exp}
                </span>
              ))}
            </div>

            <Button
              onClick={handleContactClick}
              size="lg"
              className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
            >
              Contact This Sponsor
            </Button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Track Record</h2>
            <Card>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                {Object.entries(sponsor.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-2xl font-bold text-doorlist-navy">{value}</p>
                    <p className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Leadership Team</h2>
            <Card>
              <CardContent className="p-6">
                {sponsor.team.map((member) => (
                  <div key={member.name} className="mb-4 last:mb-0">
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="text-gray-600">{member.title}</p>
                    <p className="text-sm text-gray-500">{member.experience} of experience</p>
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

export default SponsorDetail;