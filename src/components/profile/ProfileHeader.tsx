import { Card } from "@/components/ui/card";

const ProfileHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-2xl font-semibold text-doorlist-navy">Profile Information</h3>
        <p className="text-gray-600 text-sm mt-1">Manage your personal information and preferences</p>
      </div>
    </div>
  );
};

export default ProfileHeader;