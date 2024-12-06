import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, email")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setFormData({
            ...formData,
            name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
            email: profile.email || "",
          });
        }
      }
    };

    getUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Contact DoorList | Get in Touch</title>
        <meta name="description" content="Have questions about real estate investing? Contact DoorList's team for expert guidance and support." />
      </Helmet>
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you on your investment journey.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="How can we help you?"
                  className="min-h-[150px]"
                />
              </div>
              <Button type="submit" className="w-full bg-doorlist-navy hover:bg-doorlist-navy/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
