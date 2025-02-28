
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileInformation from "@/components/profile/ProfileInformation";
import SavedInvestments from "@/components/profile/SavedInvestments";
import ConnectionsInProgress from "@/components/profile/ConnectionsInProgress";
import { Helmet } from 'react-helmet-async';

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

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Fetched user profile:', data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
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
      <Helmet>
        <title>My Profile | DoorList</title>
        <meta name="description" content="Manage your DoorList profile, view saved investments, and track your investment inquiries." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold text-doorlist-navy mb-6">My Profile</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Connections in Progress</h2>
          <ConnectionsInProgress />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-doorlist-navy mb-6">Saved Investments</h2>
          <SavedInvestments 
            savedInvestments={savedInvestments} 
            isLoading={investmentsLoading}
          />
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
