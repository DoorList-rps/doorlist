import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorOverviewProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorOverview = ({ sponsor }: SponsorOverviewProps) => (
  <Card className="mb-6">
    <CardContent className="grid grid-cols-2 gap-4 p-6">
      <div>
        <p className="text-gray-500">Experience</p>
        <p className="text-xl font-semibold">
          {sponsor.year_founded ? `Since ${sponsor.year_founded}` : 'N/A'}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Assets Under Management</p>
        <p className="text-xl font-semibold">{sponsor.assets_under_management || 'N/A'}</p>
      </div>
      <div>
        <p className="text-gray-500">Location</p>
        <p className="text-xl font-semibold">{sponsor.headquarters || 'N/A'}</p>
      </div>
      <div>
        <p className="text-gray-500">Website</p>
        {sponsor.website_url ? (
          <a 
            href={sponsor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-doorlist-navy hover:underline"
          >
            Visit Site
          </a>
        ) : (
          <p className="text-xl font-semibold">N/A</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default SponsorOverview;