import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

interface SponsorHeaderProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorHeader = ({ sponsor }: SponsorHeaderProps) => {
  const { toast } = useToast();

  const handleContactClick = () => {
    toast({
      title: "Contact Request Sent",
      description: "Thank you for your interest. Our team will contact you shortly about this sponsor.",
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={sponsor.logo_url || '/placeholder.svg'}
          alt={sponsor.name || 'Sponsor logo'}
          className="w-full max-h-[300px] object-contain rounded-lg bg-gray-50 p-8"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-doorlist-navy mb-4">{sponsor.name}</h1>
        <p className="text-gray-600 mb-6">{sponsor.description}</p>
        
        {sponsor.property_types && sponsor.property_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {sponsor.property_types.map((type) => (
              <span
                key={type}
                className="bg-doorlist-navy/10 text-doorlist-navy px-4 py-2 rounded-full"
              >
                {type.trim()}
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={handleContactClick}
          size="lg"
          className="w-full bg-doorlist-salmon hover:bg-doorlist-salmon/90"
        >
          {`I'd Like a Personal Introduction to ${sponsor.name}`}
        </Button>
      </div>
    </div>
  );
};

export default SponsorHeader;