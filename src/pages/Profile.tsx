import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileInformation from "@/components/profile/ProfileInformation";
import SavedInvestments from "@/components/profile/SavedInvestments";
import ConnectionsInProgress from "@/components/profile/ConnectionsInProgress";

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

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: savedInvestments, isLoading: investmentsLoading } = useQuery({
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
            hero_image_url,
            minimum_investment,
            target_return,
            location_city,
            location_state,
            slug
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
        <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Profile</h2>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Saved Investments</h2>
          <SavedInvestments 
            savedInvestments={savedInvestments} 
            isLoading={investmentsLoading}
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Connections in Progress</h2>
          <ConnectionsInProgress />
        </div>

        <div className="mb-12">
          <ProfileInformation 
            userProfile={userProfile} 
            isLoading={profileLoading} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;