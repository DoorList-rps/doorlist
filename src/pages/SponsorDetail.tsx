import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSponsorDetail } from "@/hooks/useSponsorDetail";
import { useSponsorInvestments } from "@/hooks/useSponsorInvestments";
import SponsorHeader from "@/components/sponsor-detail/SponsorHeader";
import SponsorOverview from "@/components/sponsor-detail/SponsorOverview";
import SponsorStats from "@/components/sponsor-detail/SponsorStats";
import SponsorInvestments from "@/components/sponsor-detail/SponsorInvestments";

const SponsorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sponsor, isLoading, error } = useSponsorDetail(slug);
  const { data: investments } = useSponsorInvestments(sponsor?.name);

  console.log('Sponsor:', sponsor);
  console.log('Investments:', investments);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'Failed to load sponsor'}</p>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return <div className="min-h-screen flex items-center justify-center">Sponsor not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <SponsorHeader sponsor={sponsor} />
        <SponsorOverview sponsor={sponsor} />
        <SponsorStats sponsor={sponsor} />
        <SponsorInvestments 
          investments={investments || []} 
          sponsorName={sponsor.name}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SponsorDetail;