import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Page Not Found | DoorList</title>
        <meta name="description" content="The page you're looking for cannot be found. Return to DoorList's homepage to explore real estate investment opportunities." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for cannot be found. Please check the URL or return to our homepage.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors text-lg"
          >
            Return to Homepage
          </Link>
          <div className="mt-8 space-y-4">
            <p className="text-gray-600">You might also be interested in:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/investments"
                className="text-doorlist-salmon hover:underline"
              >
                Browse Investments
              </Link>
              <Link
                to="/sponsors"
                className="text-doorlist-salmon hover:underline"
              >
                View Sponsors
              </Link>
              <Link
                to="/education"
                className="text-doorlist-salmon hover:underline"
              >
                Education Center
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;