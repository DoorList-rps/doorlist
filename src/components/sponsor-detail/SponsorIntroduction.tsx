import { useIntroductionSubmission } from "./introduction/useIntroductionSubmission";
import IntroductionButton from "./introduction/IntroductionButton";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorIntroductionProps {
  sponsor: Tables<'sponsors'>;
  isLoggedIn: boolean;
  userId: string | null;
}

const SponsorIntroduction = ({ sponsor, isLoggedIn, userId }: SponsorIntroductionProps) => {
  const { isSubmitting, handleContactClick } = useIntroductionSubmission(sponsor, isLoggedIn, userId);
  
  return (
    <IntroductionButton 
      sponsorName={sponsor.name}
      onClick={handleContactClick}
      isSubmitting={isSubmitting}
      websiteUrl={sponsor.website_url}
    />
  );
};

export default SponsorIntroduction;