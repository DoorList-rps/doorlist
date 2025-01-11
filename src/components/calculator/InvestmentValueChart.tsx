import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCalculator } from "./CalculatorContext";

const InvestmentValueChart = () => {
  const { state } = useCalculator();
  
  const data = useMemo(() => {
    const monthlyRate = state.expectedReturn / 100 / 12;
    const inflationRate = state.inflationRate / 100;
    const periods = state.timeframe * 12;
    
    return Array.from({ length: periods + 1 }, (_, i) => {
      const month = i;
      const year = Math.floor(i / 12);
      
      // Calculate compound interest with monthly contributions
      let futureValue = state.initialInvestment * Math.pow(1 + monthlyRate, month);
      if (month > 0) {
        futureValue += state.monthlyContribution * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate);
      }

      // Calculate inflation-adjusted value
      const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate, year);

      return {
        month,
        year,
        value: futureValue,
        adjustedValue: inflationAdjustedValue,
        contributions: state.initialInvestment + (state.monthlyContribution * month),
      };
    }).filter((_, index) => index % 12 === 0); // Only show yearly data points
  }, [state.initialInvestment, state.monthlyContribution, state.timeframe, state.expectedReturn, state.inflationRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-doorlist-navy">Investment Growth Over Time</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adjustedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="contributionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => `Year ${value}`}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), ""]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Total Value"
              stroke="#8884d8"
              fill="url(#valueGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="adjustedValue"
              name="Inflation-Adjusted Value"
              stroke="#82ca9d"
              fill="url(#adjustedGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="contributions"
              name="Total Contributions"
              stroke="#ffc658"
              fill="url(#contributionsGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentValueChart;