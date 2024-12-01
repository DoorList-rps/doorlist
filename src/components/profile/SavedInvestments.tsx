import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SavedInvestmentsProps {
  savedInvestments: {
    investment_id: string;
    investments: {
      id: string;
      name: string;
      short_description: string | null;
      hero_image_url: string | null;
      minimum_investment: number | null;
      target_return: string | null;
      location_city: string | null;
      location_state: string | null;
      slug: string;
    } | null;
  }[] | null;
  isLoading: boolean;
}

const SavedInvestments = ({ savedInvestments, isLoading }: SavedInvestmentsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!savedInvestments || savedInvestments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600">No saved investments yet</h3>
        <p className="text-gray-500 mt-2">
          Browse our <Link to="/investments" className="text-doorlist-salmon hover:underline">investment opportunities</Link> to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedInvestments.map((saved) => (
        saved.investments && (
          <Link 
            key={saved.investment_id} 
            to={`/investments/${saved.investments.slug}`}
            className="block"
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={saved.investments.hero_image_url || '/placeholder.svg'}
                  alt={saved.investments.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{saved.investments.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {saved.investments.short_description}
                </p>
                {saved.investments.minimum_investment && (
                  <p className="mt-2 text-sm text-gray-500">
                    Min. Investment: ${saved.investments.minimum_investment.toLocaleString()}
                  </p>
                )}
                {(saved.investments.location_city || saved.investments.location_state) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {[saved.investments.location_city, saved.investments.location_state]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        )
      ))}
    </div>
  );
};

export default SavedInvestments;