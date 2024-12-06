import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Calculator = () => {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [results, setResults] = useState<{
    monthlyMortgage: number;
    monthlyNetIncome: number;
    cashOnCash: number;
  } | null>(null);

  const calculateInvestment = () => {
    const price = parseFloat(purchasePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(monthlyExpenses);

    const loanAmount = price - down;
    const monthlyMortgage = (loanAmount * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1);
    const monthlyNetIncome = rent - expenses - monthlyMortgage;
    const annualNetIncome = monthlyNetIncome * 12;
    const cashOnCash = (annualNetIncome / down) * 100;

    setResults({
      monthlyMortgage,
      monthlyNetIncome,
      cashOnCash,
    });
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Investment Calculator | DoorList</title>
        <meta name="description" content="Calculate potential returns on your real estate investments with DoorList's interactive investment calculator." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Investment Calculator</h1>
          
          <div className="grid gap-6">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="500000"
              />
            </div>

            <div>
              <Label htmlFor="downPayment">Down Payment ($)</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="100000"
              />
            </div>

            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="4.5"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm">Loan Term (Years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="30"
              />
            </div>

            <div>
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="3000"
              />
            </div>

            <div>
              <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                placeholder="500"
              />
            </div>

            <Button 
              onClick={calculateInvestment}
              className="bg-doorlist-navy hover:bg-doorlist-navy/90"
            >
              Calculate
            </Button>
          </div>

          {results && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Results</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Monthly Mortgage Payment</p>
                  <p className="text-xl font-semibold">${results.monthlyMortgage.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly Net Income</p>
                  <p className="text-xl font-semibold">${results.monthlyNetIncome.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cash on Cash Return</p>
                  <p className="text-xl font-semibold">{results.cashOnCash.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;