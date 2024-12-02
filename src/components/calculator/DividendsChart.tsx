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

const DividendsChart = () => {
  const data = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      year: i + 1,
      dividends: 7000 * (1 + i * 0.05),
    }));
  }, []);

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