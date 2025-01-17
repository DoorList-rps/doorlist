import { Button } from "@/components/ui/button";

interface IntroductionButtonProps {
  sponsorName: string;
  onClick: () => void;
  isSubmitting: boolean;
  websiteUrl?: string;
}

const IntroductionButton = ({ 
  sponsorName, 
  onClick, 
  isSubmitting,
  websiteUrl 
}: IntroductionButtonProps) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onClick}
        size="lg"
        className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : `I'd Like a Personal Introduction to ${sponsorName}`}
      </Button>

      {websiteUrl && (
        <Button
          onClick={() => window.open(websiteUrl, '_blank')}
          size="lg"
          className="w-full bg-doorlist-salmon/20 hover:bg-doorlist-salmon/30 text-doorlist-salmon"
        >
          View Sponsor Website
        </Button>
      )}
    </div>
  );
};

export default IntroductionButton;