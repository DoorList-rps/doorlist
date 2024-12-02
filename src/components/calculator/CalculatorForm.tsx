import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";

interface CalculatorState {
  investmentAmount: number;
  holdingPeriod: number;
  targetIRR: number;
  annualAppreciation: number;
  cashYield: number;
  showAdvanced: boolean;
}

const CalculatorForm = () => {
  const { toast } = useToast();
  const [state, setState] = useState<CalculatorState>({
    investmentAmount: 100000,
    holdingPeriod: 5,
    targetIRR: 15,
    annualAppreciation: 3,
    cashYield: 7,
    showAdvanced: false,
  });

  const handleInputChange = (field: keyof CalculatorState, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    toast({
      title: "Calculation Updated",
      description: "The investment projections have been updated with your inputs.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
        <Input
          id="investmentAmount"
          type="number"
          value={state.investmentAmount}
          onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
          min={0}
          step={1000}
        />
      </div>

      <div>
        <Label htmlFor="holdingPeriod">Holding Period (Years)</Label>
        <Slider
          id="holdingPeriod"
          min={1}
          max={10}
          step={1}
          value={[state.holdingPeriod]}
          onValueChange={([value]) => handleInputChange('holdingPeriod', value)}
          className="my-4"
        />
        <div className="text-sm text-gray-500">{state.holdingPeriod} years</div>
      </div>

      <div>
        <Label htmlFor="targetIRR">Target IRR (%)</Label>
        <Slider
          id="targetIRR"
          min={0}
          max={30}
          step={0.5}
          value={[state.targetIRR]}
          onValueChange={([value]) => handleInputChange('targetIRR', value)}
          className="my-4"
        />
        <div className="text-sm text-gray-500">{state.targetIRR}%</div>
      </div>

      <div className="flex items-center gap-2 my-4">
        <Toggle
          pressed={state.showAdvanced}
          onPressedChange={(pressed) => setState(prev => ({ ...prev, showAdvanced: pressed }))}
        >
          Advanced Options
        </Toggle>
      </div>

      {state.showAdvanced && (
        <>
          <div>
            <Label htmlFor="annualAppreciation">Annual Appreciation (%)</Label>
            <Slider
              id="annualAppreciation"
              min={0}
              max={10}
              step={0.5}
              value={[state.annualAppreciation]}
              onValueChange={([value]) => handleInputChange('annualAppreciation', value)}
              className="my-4"
            />
            <div className="text-sm text-gray-500">{state.annualAppreciation}%</div>
          </div>

          <div>
            <Label htmlFor="cashYield">Cash Yield (%)</Label>
            <Slider
              id="cashYield"
              min={0}
              max={15}
              step={0.5}
              value={[state.cashYield]}
              onValueChange={([value]) => handleInputChange('cashYield', value)}
              className="my-4"
            />
            <div className="text-sm text-gray-500">{state.cashYield}%</div>
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