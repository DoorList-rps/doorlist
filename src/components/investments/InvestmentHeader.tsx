
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const InvestmentHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-4xl font-bold text-doorlist-navy">Investment Opportunities</h1>
        <Link to="/submit-investment" className="mt-4 md:mt-0">
          <Button className="bg-doorlist-salmon hover:bg-doorlist-salmon/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Investment
          </Button>
        </Link>
      </div>
      <p className="text-gray-600 mb-4">
        Explore our curated selection of institutional-quality real estate investment opportunities. Each listing has been carefully vetted to ensure it meets our high standards for quality and potential returns.
      </p>
      <p className="text-gray-600">
        Have an investment opportunity to share? <Link to="/submit-investment" className="text-doorlist-salmon hover:underline">Submit it here</Link> for our team to review.
      </p>
    </div>
  );
};

export default InvestmentHeader;
