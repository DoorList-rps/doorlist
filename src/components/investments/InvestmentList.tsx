import { Tables } from "@/integrations/supabase/types";
import InvestmentCard from "./InvestmentCard";

interface InvestmentListProps {
  investments: (Tables<'investments'> & { 
    sponsors: Pick<Tables<'sponsors'>, 'name' | 'logo_url'> 
  })[];
  isLoading: boolean;
  error: Error | null;
}

const InvestmentList = ({ investments, isLoading, error }: InvestmentListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-red-600">Error loading investments</h3>
        <p className="text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
      </div>
    );
  }

  if (!investments || investments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600">No investments found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investments.map((investment) => (
        <InvestmentCard 
          key={investment.id} 
          investment={investment}
        />
      ))}
    </div>
  );
};

export default InvestmentList;