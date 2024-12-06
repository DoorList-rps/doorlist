import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>About DoorList | Our Mission and Vision</title>
        <meta name="description" content="Learn about DoorList's mission to democratize access to institutional-quality real estate investments and our commitment to transparency." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-doorlist-navy rounded-xl overflow-hidden mb-12 p-12 text-center">
            <div className="absolute inset-0 z-0">
              <img
                src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpg"
                alt="Hero Background"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-10">
              <img 
                src="/lovable-uploads/57591e9e-a8d6-4180-b51a-6b8bdabb29fb.png" 
                alt="DoorList Logo" 
                className="h-48 mx-auto mb-6" // Increased from h-24 to h-48
              />
              <h1 className="text-4xl font-bold text-white">About DoorList</h1>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
              <h2 className="text-2xl font-semibold text-doorlist-navy mb-6">Why We Started DoorList</h2>
              <p className="text-gray-600 mb-6">
                We're excited to introduce DoorList, an innovative platform that transforms how investors, developers, and real estate enthusiasts connect with investment opportunities. In today's rapidly evolving real estate market, DoorList emerges as a powerful tool designed to simplify, streamline, and enhance the entire process of property investment.
              </p>
              <p className="text-gray-600 mb-6">
                The real estate market can be complex, with numerous challenges in finding opportunities, verifying data, and managing investments. DoorList was born from the necessity to bridge the gap between seasoned investors seeking dependable projects and developers needing access to a network of serious buyers.
              </p>
              <p className="text-gray-600">
                Our platform isn't just another marketplace; it's a tool crafted by real estate veterans who understand the intricacies of investment from every angle. With insights from years of experience in mergers, acquisitions, and tech-driven solutions in real estate, our team has built a platform that addresses the common challenges faced in the investment journey. The principals of DoorList have been involved with acquisitions totaling over $20 billion and led investment funds with over $400 million in asset value.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-6xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  Our mission is to make real estate investment more transparent, accessible, and efficient for all parties involved. We believe that every investor should have the opportunity to participate in professionally managed real estate deals.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-6xl">💎</span>
                </div>
                <h2 className="text-2xl font-semibold text-doorlist-navy mb-4">What Sets Us Apart</h2>
                <p className="text-gray-600">
                  We provide a comprehensive platform that connects investors with high-quality real estate opportunities, making the investment process more streamlined and efficient.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-4">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Transparency</h3>
                <p className="text-gray-600">
                  We provide detailed information about each investment opportunity and sponsor, allowing investors to make informed decisions.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-4">
                  <span className="text-5xl">🚪</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  Our platform makes it easy for investors to access and invest in institutional-quality real estate deals with lower minimum investments.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-4">
                  <span className="text-5xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-doorlist-navy mb-4">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of real estate professionals provides comprehensive support, including educational content and guidance to help investors understand opportunities and make informed decisions.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
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
