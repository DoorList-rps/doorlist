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
    const yearlyRate = state.expectedReturn / 100;
    const monthlyRate = yearlyRate / 12;
    const periods = state.timeframe * 12;
    let accumulatedDividends = 0;
    
    return Array.from({ length: periods + 1 }, (_, i) => {
      const month = i;
      const year = Math.floor(i / 12);
      
      // Calculate base investment growth without monthly contributions
      let baseInvestment = state.initialInvestment * Math.pow(1 + yearlyRate, year);
      
      // Calculate monthly contributions growth if any months have passed
      let contributionsValue = 0;
      if (month > 0) {
        // Sum up all monthly contributions with their respective growth
        for (let j = 0; j < month; j++) {
          contributionsValue += state.monthlyContribution * Math.pow(1 + yearlyRate, (month - j) / 12);
        }
      }

      const futureValue = baseInvestment + contributionsValue;

      // Calculate dividends based on the current portfolio value
      const annualDividend = futureValue * (state.dividendYield / 100);
      const monthlyDividend = annualDividend / 12;

      // Handle dividend reinvestment
      if (state.reinvestDividends && month > 0) {
        accumulatedDividends = (accumulatedDividends + monthlyDividend) * (1 + monthlyRate);
        return {
          month,
          year,
          value: futureValue + accumulatedDividends,
          dividend: annualDividend,
        };
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
    if (!active || !payload || !payload.length) {
      return null;
    }

    const portfolioValue = payload[0]?.value;
    const annualDividend = payload[1]?.value;

    if (typeof portfolioValue === 'undefined') {
      return null;
    }

    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-semibold">Year {label}</p>
        <p className="text-sm">Portfolio Value: {formatCurrency(portfolioValue)}</p>
        {typeof annualDividend !== 'undefined' && (
          <p className="text-sm">Annual Dividend: {formatCurrency(annualDividend)}</p>
        )}
        <p className="text-sm text-gray-500">
          {state.reinvestDividends ? "Dividends are being reinvested" : "Dividends are paid out"}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-doorlist-navy">Investment Growth Over Time</h3>
      <div className="h-[300px] w-full">
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