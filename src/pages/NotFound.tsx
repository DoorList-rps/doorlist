import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Page Not Found | DoorList</title>
        <meta name="description" content="The page you're looking for cannot be found." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but the page you're looking for cannot be found. It might have been moved or deleted.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">Here are some helpful links:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/investments"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-doorlist-blue hover:bg-doorlist-navy transition-colors"
              >
                Browse Investments
              </Link>
              <Link
                to="/sponsors"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-doorlist-blue hover:bg-doorlist-navy transition-colors"
              >
                View Sponsors
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-doorlist-blue rounded-md text-base font-medium text-doorlist-blue hover:text-white hover:bg-doorlist-navy hover:border-doorlist-navy transition-colors"
              >
                Go to Homepage
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