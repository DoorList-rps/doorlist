import type { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";

interface SponsorInfoProps {
  sponsor: Tables<'sponsors'>;
}

const SponsorInfo = ({ sponsor }: SponsorInfoProps) => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <img
        src={sponsor.logo_url || '/placeholder.svg'}
        alt={`${sponsor.name} logo`}
        className="w-full max-h-[200px] object-contain mb-6"
      />
      
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Sub-asset Class</TableCell>
            <TableCell>{sponsor.property_types?.join(', ') || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Investment Type</TableCell>
            <TableCell>{sponsor.investment_types?.join(', ') || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Minimum Investment</TableCell>
            <TableCell>{sponsor.minimum_investment || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Deal Volume</TableCell>
            <TableCell>{formatCurrency(sponsor.deal_volume)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Assets Under Management</TableCell>
            <TableCell>{formatCurrency(sponsor.assets_under_management)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Number of Deals</TableCell>
            <TableCell>{sponsor.number_of_deals || 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SponsorInfo;