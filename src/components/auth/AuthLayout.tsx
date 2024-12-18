import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, DollarSign, Users } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-doorlist-navy mb-4">
                  Join DoorList Today
                </h1>
                <p className="text-gray-600">
                  Access exclusive real estate investment opportunities and connect with top-tier sponsors.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Building className="h-6 w-6 text-doorlist-salmon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-doorlist-navy">Premium Investment Opportunities</h3>
                    <p className="text-gray-600 text-sm">
                      Get access to carefully vetted real estate investments from established sponsors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <DollarSign className="h-6 w-6 text-doorlist-salmon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-doorlist-navy">Lower Investment Minimums</h3>
                    <p className="text-gray-600 text-sm">
                      Participate in institutional-quality deals with more accessible minimum investments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Users className="h-6 w-6 text-doorlist-salmon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-doorlist-navy">Direct Sponsor Connections</h3>
                    <p className="text-gray-600 text-sm">
                      Build relationships with experienced real estate sponsors and expand your network.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                {children}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;