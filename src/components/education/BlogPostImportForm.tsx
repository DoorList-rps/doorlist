import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BlogPostImportForm = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch content');
      
      const content = await response.text();
      
      // Extract title from the URL (you might want to adjust this based on your URL structure)
      const urlParts = url.split('/');
      const slug = urlParts[urlParts.length - 1];
      
      // Insert into Supabase
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: `Imported Post ${new Date().toLocaleDateString()}`, // You can update this later
          slug: slug,
          content: content,
          published_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post imported successfully",
      });
      
      setUrl("");
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-doorlist-navy mb-4">Import Blog Post</h2>
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Enter ContentShake URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Importing..." : "Import Post"}
      </Button>
    </form>
  );
};

export default BlogPostImportForm;