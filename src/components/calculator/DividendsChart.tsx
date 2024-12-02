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
    return Array.from({ length: state.holdingPeriod }, (_, i) => ({
      year: i + 1,
      dividends: state.investmentAmount * (state.cashYield / 100) * (1 + i * (state.annualAppreciation / 100)),
    }));
  }, [state.investmentAmount, state.holdingPeriod, state.cashYield, state.annualAppreciation]);

  return (
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
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Dividends"]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Bar dataKey="dividends" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DividendsChart;