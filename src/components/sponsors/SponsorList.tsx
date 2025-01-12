import type { Tables } from "@/integrations/supabase/types";
import SponsorCard from "./SponsorCard";

interface SponsorListProps {
  sponsors: Tables<'sponsors'>[];
}

const SponsorList = ({ sponsors }: SponsorListProps) => {
  if (!sponsors || sponsors.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600">No sponsors found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.id} sponsor={sponsor} />
      ))}
    </div>
  );
};

export default SponsorList;