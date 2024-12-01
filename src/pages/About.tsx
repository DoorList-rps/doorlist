import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] mb-12 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04"
              alt="Modern living room representing luxury real estate"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-4">About DoorList</h1>
                <p className="text-xl text-white/90">
                  Revolutionizing real estate investing through institutional-quality opportunities
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-12">
              DoorList is revolutionizing real estate investing by connecting investors with institutional-quality real estate opportunities from experienced sponsors.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f"
                  alt="Professional real estate investment"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  Our mission is to democratize access to institutional-quality real estate investments. We believe that every investor should have the opportunity to participate in professionally managed real estate deals that have historically been reserved for institutional investors.
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1501286353178-1ec881214838"
                  alt="Investment growth concept"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">What Sets Us Apart</h2>
                <p className="text-gray-600 mb-6">
                  We carefully select and vet each investment opportunity and sponsor on our platform, ensuring that only high-quality deals are presented to our investors.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We provide detailed information about each investment opportunity and sponsor, allowing investors to make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  Our platform makes it easy for investors to access and invest in institutional-quality real estate deals with lower minimum investments.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of real estate professionals is available to help investors understand opportunities and make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1438565434616-3ef039228b15"
                  alt="Professional expertise"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
              </div>
            </div>

            <div className="bg-doorlist-navy text-white p-8 rounded-lg mt-12">
              <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
              <p className="mb-4 text-white/90">
                Follow us on social media to stay updated on the latest investment opportunities and real estate insights.
              </p>
              <a 
                href="https://x.com/DoorList_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-white hover:text-doorlist-salmon transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow us on X
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;