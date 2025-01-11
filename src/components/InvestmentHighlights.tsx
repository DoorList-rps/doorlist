import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Building2, Users, BadgeDollarSign, Handshake } from "lucide-react";

const InvestmentHighlights = () => {
  const highlights = [
    {
      icon: <Building2 className="w-12 h-12 text-doorlist-salmon mb-4" />,
      title: "Institutional Quality",
      description: "Access real estate deals typically reserved for large investors",
      link: "/investments"
    },
    {
      icon: <Users className="w-12 h-12 text-doorlist-salmon mb-4" />,
      title: "Experienced Sponsors",
      description: "Invest alongside experienced sponsors with proven track records",
      link: "/sponsors"
    },
    {
      icon: <BadgeDollarSign className="w-12 h-12 text-doorlist-salmon mb-4" />,
      title: "Low Minimums",
      description: "Investment minimums starting as low as $100",
      link: "/calculator"
    },
    {
      icon: <Handshake className="w-12 h-12 text-doorlist-salmon mb-4" />,
      title: "White Glove Service",
      description: "Direct connections to real estate managers facilitated by DoorList",
      link: "/contact"
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doorlist-navy mb-4">
            Why Invest Through DoorList
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make it easy to invest in institutional-quality real estate deals. 
            <Link to="/about" className="text-doorlist-salmon hover:underline ml-1">
              Learn more about our mission
            </Link>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {highlights.map((highlight, index) => (
            <Link key={index} to={highlight.link}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="flex justify-center">{highlight.icon}</div>
                  <h3 className="text-xl font-semibold text-doorlist-navy mb-2">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 space-y-4">
          <Link
            to="/investments"
            className="inline-flex items-center px-8 py-3 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors text-lg"
          >
            View Available Deals
          </Link>
          <div className="text-gray-600">
            New to real estate investing? Visit our{' '}
            <Link to="/education" className="text-doorlist-salmon hover:underline">
              Education Center
            </Link>
            {' '}or check our{' '}
            <Link to="/faq" className="text-doorlist-salmon hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentHighlights;