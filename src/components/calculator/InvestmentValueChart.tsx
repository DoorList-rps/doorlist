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
    const periods = state.timeframe * 12;
    let accumulatedDividends = 0;
    
    return Array.from({ length: periods + 1 }, (_, i) => {
      const month = i;
      const year = Math.floor(i / 12);
      
      // Calculate compound interest with monthly contributions
      let futureValue = state.initialInvestment * Math.pow(1 + monthlyRate, month);
      if (month > 0) {
        futureValue += state.monthlyContribution * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate);
      }

      // Calculate annual dividend based on the current portfolio value
      const annualDividend = futureValue * (state.dividendYield / 100);
      const monthlyDividend = annualDividend / 12;

      // Handle dividend reinvestment
      if (state.reinvestDividends) {
        accumulatedDividends += monthlyDividend;
        futureValue += accumulatedDividends;
      }

      return {
        month,
        year,
        value: futureValue,
        dividend: annualDividend,
      };
    }).filter((_, index) => index % 12 === 0); // Only show yearly data points
  }, [state.initialInvestment, state.monthlyContribution, state.timeframe, state.expectedReturn, state.dividendYield, state.reinvestDividends]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-semibold">Year {label}</p>
          <p className="text-sm">Portfolio Value: {formatCurrency(payload[0].value)}</p>
          <p className="text-sm">Annual Dividend: {formatCurrency(payload[1].value)}</p>
          <p className="text-sm text-gray-500">
            {state.reinvestDividends ? "Dividends are being reinvested" : "Dividends are paid out"}
          </p>
        </div>
      );
    }
    return null;
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
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => `Year ${value}`}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name="Portfolio Value"
              stroke="#8884d8"
              fill="url(#valueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentValueChart;