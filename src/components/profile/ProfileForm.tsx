
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import ProfileFields from "./ProfileFields";
import ProfileActions from "./ProfileActions";

interface ProfileFormProps {
  userProfile: Tables<'profiles'> | null;
}

const ProfileForm = ({ userProfile }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    phone_number: userProfile?.phone_number || '',
    email: userProfile?.email || '',
    is_accredited_investor: userProfile?.is_accredited_investor === null 
      ? "" 
      : userProfile?.is_accredited_investor 
        ? "true" 
        : "false"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: {
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      email?: string;
      is_accredited_investor?: boolean;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Fix: Convert empty strings to null to avoid empty string values in the database
      const sanitizedProfile = Object.entries(updatedProfile).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? null : value;
        return acc;
      }, {} as Record<string, any>);

      console.log('Updating profile with data:', sanitizedProfile);

      const { error, data } = await supabase
        .from('profiles')
        .update(sanitizedProfile)
        .eq('id', session.user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update the local cache with the returned data
      queryClient.setQueryData(['user-profile'], data?.[0] || null);
      
      // Then invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    // Convert string representation of boolean to actual boolean
    const processedFormData = {
      ...formData,
      is_accredited_investor: formData.is_accredited_investor === "true" ? true : 
                              formData.is_accredited_investor === "false" ? false : null
    };
    
    updateProfileMutation.mutate(processedFormData);
  };

  const handleCancel = () => {
    setFormData({
      first_name: userProfile?.first_name || '',
      last_name: userProfile?.last_name || '',
      phone_number: userProfile?.phone_number || '',
      email: userProfile?.email || '',
      is_accredited_investor: userProfile?.is_accredited_investor === null 
        ? "" 
        : userProfile?.is_accredited_investor 
          ? "true" 
          : "false"
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ProfileActions 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <ProfileFields 
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        userProfile={userProfile}
      />
    </div>
  );
};

export default ProfileForm;
