import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalculatorProvider } from "@/components/calculator/CalculatorContext";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import InvestmentValueChart from "@/components/calculator/InvestmentValueChart";
import DividendsChart from "@/components/calculator/DividendsChart";

const Calculator = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Investment Calculator | DoorList</title>
        <meta 
          name="description" 
          content="Plan your investment strategy with DoorList's comprehensive investment calculator. Estimate returns, analyze growth potential, and make informed decisions." 
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-6">Real Estate Investment Calculator</h1>
          <p className="text-lg text-gray-600 mb-8">
            Use our calculator to estimate potential returns on your investments over time. 
            Adjust variables like initial investment, monthly contributions, and expected returns 
            to see how your investment could grow.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <CalculatorProvider>
              <div>
                <CalculatorForm />
              </div>
              <div className="space-y-6">
                <InvestmentValueChart />
                <DividendsChart />
              </div>
            </CalculatorProvider>
          </div>

          <div className="mt-16 space-y-8 text-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">Understanding the Investment Calculator</h2>
              <p className="mb-4">
                Our real estate investment calculator is designed to help you visualize the potential growth of your investment over time. Whether you're considering a single property investment or exploring multiple opportunities on DoorList, this tool provides valuable insights into your investment's potential performance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-doorlist-navy mb-3">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Initial Investment: Set your starting investment amount based on the minimum investment requirements of our listed opportunities.</li>
                <li>Monthly Contributions: Plan for regular additional investments to grow your portfolio over time.</li>
                <li>Expected Returns: Model different scenarios using historical performance data from similar investments.</li>
                <li>Dividend Yield: Understand potential passive income through regular distributions.</li>
                <li>Reinvestment Options: See how reinvesting dividends could compound your returns.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-doorlist-navy mb-3">How to Use This Calculator</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Start by entering your initial investment amount - this could match the minimum investment requirement of a specific opportunity you're interested in.</li>
                <li>Set any monthly contributions you plan to make to grow your investment over time.</li>
                <li>Adjust the expected annual return based on the target returns provided in our investment listings.</li>
                <li>Input the dividend yield percentage, typically found in the investment details of our offerings.</li>
                <li>Choose whether to reinvest dividends to potentially increase your long-term returns.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-doorlist-navy mb-3">Making Informed Decisions</h3>
              <p className="mb-4">
                While this calculator provides valuable projections, remember that actual returns may vary. We recommend using this tool alongside the detailed information provided in our investment listings, sponsor track records, and market analysis to make well-informed investment decisions.
              </p>
              <p>
                Ready to explore real investment opportunities? Visit our <a href="/investments" className="text-doorlist-salmon hover:underline">Investments page</a> to browse current offerings or connect with experienced <a href="/sponsors" className="text-doorlist-salmon hover:underline">Sponsors</a> in our network.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;