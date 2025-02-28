
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/integrations/supabase/types";

interface ProfileFieldsProps {
  formData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    is_accredited_investor: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
  userProfile: Tables<'profiles'> | null;
}

const ProfileFields = ({ formData, setFormData, isEditing, userProfile }: ProfileFieldsProps) => {
  return (
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
        {isEditing ? (
          <div className="relative">
            <Input
              value={formData.email}
              readOnly
              className="border-gray-200 bg-gray-50 cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              Cannot be changed
            </div>
          </div>
        ) : (
          <p className="py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
            {userProfile?.email || 'Not set'}
          </p>
        )}
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
  );
};

export default ProfileFields;
