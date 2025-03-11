
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface InvestmentAttachmentsProps {
  investment: Tables<'investments'>;
}

const InvestmentAttachments = ({ investment }: InvestmentAttachmentsProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (investment.attachments) {
      // Cast the JSON data to Attachment[] with type checking
      const attachmentData = investment.attachments as any[];
      const validAttachments = attachmentData.filter(
        (attachment): attachment is Attachment => 
          typeof attachment === 'object' && 
          attachment !== null &&
          typeof attachment.name === 'string' &&
          typeof attachment.url === 'string' &&
          typeof attachment.type === 'string' &&
          typeof attachment.size === 'number'
      );
      setAttachments(validAttachments);
    }
  }, [investment.attachments]);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-doorlist-navy mb-4">Documents</h2>
      <div className="space-y-4">
        {attachments.map((attachment, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <FileDown className="h-6 w-6 text-doorlist-navy" />
              <div>
                <p className="font-medium">{attachment.name}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(attachment.size / 1024)} KB • {attachment.type}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(attachment.url, '_blank')}
            >
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentAttachments;
