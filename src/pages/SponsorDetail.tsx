import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSponsorDetail } from "@/hooks/useSponsorDetail";
import { useSponsorInvestments } from "@/hooks/useSponsorInvestments";
import SponsorHeader from "@/components/sponsor-detail/SponsorHeader";
import SponsorInvestments from "@/components/sponsor-detail/SponsorInvestments";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SponsorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sponsor, isLoading, error } = useSponsorDetail(slug);
  const { data: investments } = useSponsorInvestments(sponsor?.name);

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
        <div className="mb-6">
          <Link to="/sponsors">
            <Button variant="ghost" className="text-doorlist-navy hover:text-doorlist-salmon">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsors List
            </Button>
          </Link>
        </div>
        <SponsorHeader sponsor={sponsor} />
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