import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCalculator } from "./CalculatorContext";

const CalculatorForm = () => {
  const { toast } = useToast();
  const { state, setState } = useCalculator();

  const handleInputChange = (field: keyof typeof state, value: number | string | boolean) => {
    setState({ ...state, [field]: value });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
        <div className="mt-1.5">
          <Input
            id="initialInvestment"
            type="number"
            value={state.initialInvestment}
            onChange={(e) => handleInputChange('initialInvestment', Number(e.target.value))}
            min={0}
            step={1000}
            className="text-lg"
          />
          <div className="text-sm text-muted-foreground mt-1">
            {formatCurrency(state.initialInvestment)}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
        <div className="mt-1.5">
          <Input
            id="monthlyContribution"
            type="number"
            value={state.monthlyContribution}
            onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
            min={0}
            step={100}
            className="text-lg"
          />
          <div className="text-sm text-muted-foreground mt-1">
            {formatCurrency(state.monthlyContribution)}
          </div>
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

      <div className="flex items-center gap-2 my-4">
        <Toggle
          pressed={state.showAdvanced}
          onPressedChange={(pressed) => handleInputChange('showAdvanced', pressed)}
        >
          Advanced Options
        </Toggle>
      </div>

      {state.showAdvanced && (
        <>
          <div>
            <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
            <Select
              value={state.compoundingFrequency}
              onValueChange={(value: "annually" | "monthly") => 
                handleInputChange('compoundingFrequency', value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
            <Slider
              id="inflationRate"
              min={0}
              max={10}
              step={0.5}
              value={[state.inflationRate]}
              onValueChange={([value]) => handleInputChange('inflationRate', value)}
              className="my-4"
            />
            <div className="text-sm text-muted-foreground">{state.inflationRate}%</div>
          </div>
        </>
      )}

      <Button onClick={handleCalculate} className="w-full">
        Calculate Returns
      </Button>
    </div>
  );
};

export default CalculatorForm;