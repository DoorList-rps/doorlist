import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-doorlist-navy rounded-xl overflow-hidden mb-12 p-12 text-center">
            <div className="text-center mb-6">
              <span className="text-6xl">🏢</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">About DoorList</h1>
            <p className="text-xl text-white/90">
              Revolutionizing real estate investing through institutional-quality opportunities
            </p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-12">
              DoorList is revolutionizing real estate investing by connecting investors with institutional-quality real estate opportunities from experienced sponsors.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-6xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  Our mission is to democratize access to institutional-quality real estate investments. We believe that every investor should have the opportunity to participate in professionally managed real estate deals that have historically been reserved for institutional investors.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-6xl">💎</span>
                </div>
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">What Sets Us Apart</h2>
                <p className="text-gray-600 mb-6">
                  We carefully select and vet each investment opportunity and sponsor on our platform, ensuring that only high-quality deals are presented to our investors.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We provide detailed information about each investment opportunity and sponsor, allowing investors to make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-5xl">🚪</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  Our platform makes it easy for investors to access and invest in institutional-quality real estate deals with lower minimum investments.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-5xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of real estate professionals is available to help investors understand opportunities and make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-center mb-4">
                  <span className="text-5xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Growth Focus</h3>
                <p className="text-gray-600">
                  We're committed to helping our investors grow their real estate portfolios through carefully selected opportunities.
                </p>
              </div>
            </div>

            <div className="bg-doorlist-navy text-white p-8 rounded-lg mt-12">
              <div className="text-center mb-4">
                <span className="text-5xl">🤝</span>
              </div>
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