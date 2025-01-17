import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions = ({ isEditing, setIsEditing, onSave, onCancel }: ProfileActionsProps) => {
  return (
    <div className="flex justify-end">
      {!isEditing ? (
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-doorlist-salmon hover:bg-doorlist-navy transition-colors"
        >
          Edit Profile
        </Button>
      ) : (
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={onSave}
            className="bg-doorlist-salmon hover:bg-doorlist-navy transition-colors"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileActions;