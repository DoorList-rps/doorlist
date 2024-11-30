import { Building, Users, DollarSign, ChartBar } from "lucide-react";

const highlights = [
  {
    icon: Building,
    title: "Premium Properties",
    description: "Access institutional-quality real estate investments across various asset classes",
  },
  {
    icon: Users,
    title: "Experienced Sponsors",
    description: "Partner with seasoned real estate professionals with proven track records",
  },
  {
    icon: DollarSign,
    title: "Attractive Returns",
    description: "Target compelling risk-adjusted returns through carefully selected opportunities",
  },
  {
    icon: ChartBar,
    title: "Portfolio Diversification",
    description: "Diversify your portfolio with real estate investments across different markets",
  },
];

const InvestmentHighlights = () => {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-doorlist-navy text-center mb-16">
          Why Invest with DoorList
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-doorlist-salmon bg-opacity-10 mb-6">
                <highlight.icon className="w-8 h-8 text-doorlist-salmon" />
              </div>
              <h3 className="text-xl font-semibold text-doorlist-navy mb-3">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentHighlights;