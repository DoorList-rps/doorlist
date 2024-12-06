import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface InvestmentDetailsProps {
  investment: Tables<'investments'>;
}

const InvestmentDetails = ({ investment }: InvestmentDetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Investment Details</h2>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {[
            { label: 'Property Type', value: investment.property_type },
            { label: 'Investment Type', value: investment.investment_type },
            { label: 'Hold Period', value: investment.hold_period },
            { label: 'Distribution Frequency', value: investment.distribution_frequency },
            { label: 'Total Equity', value: investment.total_equity ? formatCurrency(investment.total_equity.toString()) : null },
            { label: 'Equity Remaining', value: investment.equity_remaining ? formatCurrency(investment.equity_remaining.toString()) : null },
            { label: 'Accredited Only', value: investment.accredited_only ? 'Yes' : 'No' },
            { label: 'Closing Date', value: investment.closing_date ? new Date(investment.closing_date).toLocaleDateString() : null }
          ].map(({ label, value }) => value && (
            <div key={label} className="flex justify-between py-2 border-b last:border-0">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentDetails;