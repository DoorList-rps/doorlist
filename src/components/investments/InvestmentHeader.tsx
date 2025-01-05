import { Link } from "react-router-dom";

const InvestmentHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Investment Opportunities</h1>
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