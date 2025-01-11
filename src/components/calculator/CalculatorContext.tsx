import { createContext, useContext, useState, ReactNode } from "react";

export interface CalculatorState {
  initialInvestment: number;
  monthlyContribution: number;
  timeframe: number;
  expectedReturn: number;
  compoundingFrequency: "annually" | "monthly";
  inflationRate: number;
  showAdvanced: boolean;
  // Adding the missing properties
  holdingPeriod: number;
  investmentAmount: number;
  cashYield: number;
  annualAppreciation: number;
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
    // Adding initial values for the new properties
    holdingPeriod: 10,
    investmentAmount: 10000,
    cashYield: 5,
    annualAppreciation: 2,
  });

  return (
    <CalculatorContext.Provider value={{ state, setState }}>
      {children}
    </CalculatorContext.Provider>
  );
};