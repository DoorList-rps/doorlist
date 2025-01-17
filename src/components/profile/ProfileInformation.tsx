import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";

interface ProfileInformationProps {
  userProfile: Tables<'profiles'> | null;
  isLoading: boolean;
}

const ProfileInformation = ({ userProfile, isLoading }: ProfileInformationProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6 space-y-6">
        <ProfileHeader />
        <ProfileForm userProfile={userProfile} />
      </CardContent>
    </Card>
  );
};

export default ProfileInformation;