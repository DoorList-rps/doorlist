import { createContext, useContext, ReactNode } from "react";

export interface CalculatorState {
  investmentAmount: number;
  holdingPeriod: number;
  targetIRR: number;
  annualAppreciation: number;
  cashYield: number;
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
    investmentAmount: 100000,
    holdingPeriod: 5,
    targetIRR: 15,
    annualAppreciation: 3,
    cashYield: 7,
    showAdvanced: false,
  });

  return (
    <CalculatorContext.Provider value={{ state, setState }}>
      {children}
    </CalculatorContext.Provider>
  );
};