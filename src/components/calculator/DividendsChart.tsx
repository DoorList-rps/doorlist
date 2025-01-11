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
    return Array.from({ length: state.timeframe }, (_, i) => ({
      year: i + 1,
      dividends: state.initialInvestment * (state.dividendYield / 100) * 
        (1 + i * (state.expectedReturn / 100)),
    }));
  }, [state.initialInvestment, state.timeframe, state.dividendYield, state.expectedReturn]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-doorlist-navy">Annual Dividends</h3>
      <div className="h-[300px] w-full">
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