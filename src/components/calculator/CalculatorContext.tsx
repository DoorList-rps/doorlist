import { createContext, useContext, useState, ReactNode } from "react";

export interface CalculatorState {
  initialInvestment: number;
  monthlyContribution: number;
  timeframe: number;
  expectedReturn: number;
  compoundingFrequency: "annually" | "monthly";
  inflationRate: number;
  showAdvanced: boolean;
}

interface CalculatorContextType {
  state: CalculatorState;
  setState: (state: CalculatorState) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CalculatorState>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    timeframe: 10,
    expectedReturn: 7,
    compoundingFrequency: "annually",
    inflationRate: 2.5,
    showAdvanced: false,
  });

  return (
    <CalculatorContext.Provider value={{ state, setState }}>
      {children}
    </CalculatorContext.Provider>
  );
};