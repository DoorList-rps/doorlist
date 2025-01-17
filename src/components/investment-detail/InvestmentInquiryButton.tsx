import { useInquirySubmission } from "./inquiry/useInquirySubmission";
import InquiryButton from "./inquiry/InquiryButton";

interface InvestmentInquiryButtonProps {
  investmentId: string;
  isLoggedIn: boolean;
  userId: string | null;
}

const InvestmentInquiryButton = ({ investmentId, isLoggedIn, userId }: InvestmentInquiryButtonProps) => {
  const { isSubmitting, handleInquiry } = useInquirySubmission(investmentId, isLoggedIn, userId);
  
  return (
    <InquiryButton 
      onClick={handleInquiry}
      isSubmitting={isSubmitting}
    />
  );
};

export default InvestmentInquiryButton;