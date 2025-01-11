import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useCalculator } from "./CalculatorContext";

const CalculatorForm = () => {
  const { toast } = useToast();
  const { state, setState } = useCalculator();

  const handleInputChange = (field: keyof typeof state, value: number) => {
    setState({ ...state, [field]: value });
  };

  const formatInputValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('$', '');
  };

  const handleCurrencyInput = (field: 'initialInvestment' | 'monthlyContribution', value: string) => {
    const numericValue = Number(value.replace(/[^0-9]/g, ''));
    handleInputChange(field, numericValue);
  };

  const handleCalculate = () => {
    toast({
      title: "Calculation Updated",
      description: "Your investment projections have been updated.",
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <Label htmlFor="initialInvestment">Initial Investment</Label>
        <div className="mt-1.5 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="initialInvestment"
            type="text"
            value={formatInputValue(state.initialInvestment)}
            onChange={(e) => handleCurrencyInput('initialInvestment', e.target.value)}
            className="pl-7 text-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
        <div className="mt-1.5 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="monthlyContribution"
            type="text"
            value={formatInputValue(state.monthlyContribution)}
            onChange={(e) => handleCurrencyInput('monthlyContribution', e.target.value)}
            className="pl-7 text-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timeframe">Investment Timeframe (Years)</Label>
        <Slider
          id="timeframe"
          min={1}
          max={40}
          step={1}
          value={[state.timeframe]}
          onValueChange={([value]) => handleInputChange('timeframe', value)}
          className="my-4"
        />
        <div className="text-sm text-muted-foreground">{state.timeframe} years</div>
      </div>

      <div>
        <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
        <Slider
          id="expectedReturn"
          min={1}
          max={15}
          step={0.5}
          value={[state.expectedReturn]}
          onValueChange={([value]) => handleInputChange('expectedReturn', value)}
          className="my-4"
        />
        <div className="text-sm text-muted-foreground">{state.expectedReturn}%</div>
      </div>

      <div>
        <Label htmlFor="dividendYield">Expected Dividend Yield (%)</Label>
        <Slider
          id="dividendYield"
          min={0}
          max={10}
          step={0.5}
          value={[state.dividendYield]}
          onValueChange={([value]) => handleInputChange('dividendYield', value)}
          className="my-4"
        />
        <div className="text-sm text-muted-foreground">{state.dividendYield}%</div>
      </div>

      <Button onClick={handleCalculate} className="w-full">
        Calculate Returns
      </Button>
    </div>
  );
};

export default CalculatorForm;