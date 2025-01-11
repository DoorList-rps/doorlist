import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

interface ProfileInformationProps {
  userProfile: Tables<'profiles'> | null;
  isLoading: boolean;
}

const ProfileInformation = ({ userProfile, isLoading }: ProfileInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    phone_number: userProfile?.phone_number || '',
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
      is_accredited_investor?: boolean;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...formData,
      is_accredited_investor: formData.is_accredited_investor === "true"
    });
  };

  const handleCancel = () => {
    setFormData({
      first_name: userProfile?.first_name || '',
      last_name: userProfile?.last_name || '',
      phone_number: userProfile?.phone_number || '',
      is_accredited_investor: userProfile?.is_accredited_investor === null 
        ? "" 
        : userProfile?.is_accredited_investor 
          ? "true" 
          : "false"
    });
    setIsEditing(false);
  };

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-doorlist-navy">Profile Information</h3>
            <p className="text-gray-600 text-sm mt-1">Manage your personal information and preferences</p>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-doorlist-salmon hover:bg-doorlist-navy transition-colors"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button 
                onClick={handleSave}
                className="bg-doorlist-salmon hover:bg-doorlist-navy transition-colors"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">First Name</label>
            {isEditing ? (
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Enter your first name"
                className="border-gray-200 focus:border-doorlist-salmon"
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
                {userProfile?.first_name || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Last Name</label>
            {isEditing ? (
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Enter your last name"
                className="border-gray-200 focus:border-doorlist-salmon"
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
                {userProfile?.last_name || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
              {userProfile?.email || 'Not set'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Phone Number</label>
            {isEditing ? (
              <Input
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Enter your phone number"
                className="border-gray-200 focus:border-doorlist-salmon"
              />
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
                {userProfile?.phone_number || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Accredited Investor Status</label>
            {isEditing ? (
              <Select
                value={formData.is_accredited_investor}
                onValueChange={(value) => setFormData({ ...formData, is_accredited_investor: value })}
              >
                <SelectTrigger className="border-gray-200 focus:border-doorlist-salmon">
                  <SelectValue placeholder="Select accredited status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
                {userProfile?.is_accredited_investor === null
                  ? 'Not set'
                  : userProfile?.is_accredited_investor
                    ? 'Yes'
                    : 'No'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInformation;