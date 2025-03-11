
import { useCallback, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AttachmentsUploadProps {
  onAttachmentsChange: (attachments: any[]) => void;
}

const AttachmentsUpload = ({ onAttachmentsChange }: AttachmentsUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);

  const uploadFile = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('investment-attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('investment-attachments')
        .getPublicUrl(filePath);

      return {
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const newAttachments = [];

      for (const file of Array.from(files)) {
        const attachment = await uploadFile(file);
        newAttachments.push(attachment);
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      onAttachmentsChange([...attachments, ...newAttachments]);
      
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    onAttachmentsChange(newAttachments);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Documents'}
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsUpload;
