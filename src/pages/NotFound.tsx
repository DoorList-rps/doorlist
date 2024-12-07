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
      
      <main className="flex-grow container mx-auto px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-[40px] font-bold text-doorlist-navy mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but the page you're looking for cannot be found. It might have been moved or deleted.
          </p>
          <div className="space-y-6">
            <p className="text-gray-600">Here are some helpful links:</p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 border border-doorlist-salmon rounded-md text-base font-medium text-doorlist-salmon hover:text-white hover:bg-doorlist-salmon transition-colors duration-200"
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