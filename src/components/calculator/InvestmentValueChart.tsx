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
    return Array.from({ length: state.holdingPeriod }, (_, i) => ({
      year: i + 1,
      value: state.investmentAmount * Math.pow(1 + state.targetIRR / 100, i),
    }));
  }, [state.investmentAmount, state.holdingPeriod, state.targetIRR]);

  return (
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
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#valueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentValueChart;