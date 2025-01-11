import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCalculator } from "./CalculatorContext";

const DividendsChart = () => {
  const { state } = useCalculator();
  
  const data = useMemo(() => {
    const yearlyRate = state.expectedReturn / 100;
    let currentPortfolioValue = state.initialInvestment;
    
    return Array.from({ length: state.timeframe }, (_, i) => {
      const year = i + 1;
      
      // Calculate base investment growth
      currentPortfolioValue = currentPortfolioValue * (1 + yearlyRate);
      
      // Add this year's contributions (grown for the partial year)
      const yearlyContribution = state.monthlyContribution * 12;
      currentPortfolioValue += yearlyContribution * (1 + yearlyRate / 2); // Assuming contributions are made evenly throughout the year
      
      // Calculate dividends based on current portfolio value
      const annualDividend = currentPortfolioValue * (state.dividendYield / 100);
      
      if (state.reinvestDividends) {
        // If reinvesting, add dividends to portfolio value for next year
        currentPortfolioValue += annualDividend;
      }
      
      return {
        year,
        dividends: annualDividend,
      };
    });
  }, [state.initialInvestment, state.timeframe, state.dividendYield, state.expectedReturn, state.monthlyContribution, state.reinvestDividends]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-doorlist-navy">Annual Dividends</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => `Year ${value}`}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`, "Dividends"]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Bar dataKey="dividends" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DividendsChart;