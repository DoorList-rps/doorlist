import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSponsorDetail } from "@/hooks/useSponsorDetail";
import { useSponsorInvestments } from "@/hooks/useSponsorInvestments";
import SponsorHeader from "@/components/sponsor-detail/SponsorHeader";
import SponsorEditorial from "@/components/sponsor-detail/SponsorEditorial";
import SponsorInvestments from "@/components/sponsor-detail/SponsorInvestments";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SponsorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sponsor, isLoading, error } = useSponsorDetail(slug);
  const { data: investments } = useSponsorInvestments(sponsor?.name);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Helmet>
          <title>Loading Sponsor | DoorList</title>
        </Helmet>
        Loading...
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Helmet>
          <title>Sponsor Not Found | DoorList</title>
          <meta name="description" content="The sponsor you're looking for could not be found." />
        </Helmet>
        Sponsor not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${sponsor.name} | Investment Sponsor | DoorList`}</title>
        <meta name="description" content={sponsor.short_description || `Learn about ${sponsor.name}, a trusted real estate investment sponsor on DoorList.`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="sr-only">{sponsor.name}</h1>
        <div className="mb-6">
          <Link to="/sponsors">
            <Button variant="ghost" className="text-doorlist-navy hover:text-doorlist-salmon">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsors
            </Button>
          </Link>
        </div>
        <SponsorHeader sponsor={sponsor} />
        <SponsorInvestments 
          investments={investments || []} 
          sponsorName={sponsor.name}
        />
        <SponsorEditorial sponsor={sponsor} />
      </main>
      <Footer />
    </div>
  );
};

export default SponsorDetail;