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
      
      // Calculate this year's dividend based on starting portfolio value
      const annualDividend = currentPortfolioValue * (state.dividendYield / 100);
      
      // If reinvesting, add dividend to portfolio before growing it
      if (state.reinvestDividends) {
        currentPortfolioValue += annualDividend;
      }
      
      // Grow the portfolio value for next year (including reinvested dividends if applicable)
      currentPortfolioValue = currentPortfolioValue * (1 + yearlyRate);
      
      // Add this year's monthly contributions (grown for half a year on average)
      const yearlyContribution = state.monthlyContribution * 12;
      currentPortfolioValue += yearlyContribution * (1 + yearlyRate / 2);
      
      return {
        year,
        dividends: Math.round(annualDividend),
      };
    });
  }, [state.initialInvestment, state.monthlyContribution, state.timeframe, state.expectedReturn, state.dividendYield, state.reinvestDividends]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

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
              tickFormatter={formatYAxis}
            />
            <Tooltip
              formatter={(value: number) => [
                formatYAxis(value),
                "Dividends"
              ]}
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