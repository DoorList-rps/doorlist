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
        <meta name="description" content="Calculate potential returns on your real estate investments with DoorList's interactive investment calculator." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Calculator</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <CalculatorProvider>
            <div className="space-y-8">
              <CalculatorForm />
            </div>
            <div className="space-y-8">
              <InvestmentValueChart />
              <DividendsChart />
            </div>
          </CalculatorProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
