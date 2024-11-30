import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Disclosures = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Disclosures</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-sm text-gray-600">
              The information provided on DoorList is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security.
            </p>
          </div>

          <h2>Investment Risks</h2>
          <p>
            Real estate investments involve substantial risks and are not suitable for all investors. Investments may lose value and past performance does not guarantee future results.
          </p>

          <h2>Accredited Investor Status</h2>
          <p>
            Many investments on DoorList are limited to accredited investors. You should verify your accredited investor status before investing.
          </p>

          <h2>Third-Party Information</h2>
          <p>
            Information about investment opportunities is provided by third-party sponsors. While we strive to verify this information, we cannot guarantee its accuracy.
          </p>

          <h2>Regulatory Compliance</h2>
          <p>
            DoorList is not a registered broker-dealer or investment advisor. We do not provide investment advice or recommendations.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclosures;