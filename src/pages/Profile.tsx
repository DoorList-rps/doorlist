import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: savedInvestments, isLoading } = useQuery({
    queryKey: ['saved-investments'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_investments')
        .select(`
          investment_id,
          investments (
            id,
            name,
            short_description,
            thumbnail_url,
            hero_image_url,
            minimum_investment,
            target_return,
            location_city,
            location_state
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold text-doorlist-navy mb-8">My Saved Investments</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doorlist-navy"></div>
          </div>
        ) : !savedInvestments || savedInvestments.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No saved investments yet</h3>
            <p className="text-gray-500 mt-2">
              Browse our <Link to="/investments" className="text-doorlist-salmon hover:underline">investment opportunities</Link> to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInvestments.map((saved) => (
              <Link 
                key={saved.investment_id} 
                to={`/investments/${saved.investment_id}`}
                className="block"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={saved.investments?.thumbnail_url || saved.investments?.hero_image_url || '/placeholder.svg'}
                      alt={saved.investments?.name}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{saved.investments?.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {saved.investments?.short_description}
                    </p>
                    {saved.investments?.minimum_investment && (
                      <p className="mt-2 text-sm text-gray-500">
                        Min. Investment: ${saved.investments.minimum_investment.toLocaleString()}
                      </p>
                    )}
                    {(saved.investments?.location_city || saved.investments?.location_state) && (
                      <p className="mt-1 text-sm text-gray-500">
                        {[saved.investments.location_city, saved.investments.location_state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;