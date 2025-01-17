import { Button } from "@/components/ui/button";

interface InquiryButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
}

const InquiryButton = ({ onClick, isSubmitting }: InquiryButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isSubmitting}
      className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
    >
      {isSubmitting ? "Submitting..." : "Request Investment Details"}
    </Button>
  );
};

export default InquiryButton;