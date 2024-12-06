import React from 'react';
import { Link } from 'react-router-dom';

const FooterLegal = () => {
  return (
    <>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} DoorList. All rights reserved.</p>
      </div>
      <div className="mt-8 text-xs text-gray-500 leading-relaxed">
        <p className="mb-4">
          This site is operated by DoorList LLC (together with its affiliates and related entities, the "Company"). It includes information about real estate investment opportunities and entities ("Securities"). Securities offerings are speculative and involve substantial risks. Before making any investment, carefully consider the risks outlined in the applicable investment offering documents. These risks may include, but are not limited to, illiquidity, lack of diversification, potential loss of your entire investment, default risk, and capital call risk. Investments may not achieve their objectives, and past performance is not indicative of future results. Individuals who cannot afford to lose their entire investment should not invest in such offerings.
        </p>
        <p className="mb-4">
          There is no guarantee that any stated valuations, projections, or other terms presented on this website are accurate, reliable, or in agreement with market or industry terms or valuations. The information and materials on this website do not constitute investment, legal, or tax advice. Prospective investors should consult their own advisors before making any investment decisions.
        </p>
        <p className="mb-4">
          By accessing this site and any pages thereof, you agree to be bound by the Terms of Use and Privacy Policy. The fact that the Company or its affiliates may participate in or have an interest in any particular offering does not constitute and should not be considered a recommendation or endorsement of such Securities, as the Company's investment criteria may differ materially from yours.
        </p>
        <p>
          For further details, please refer to the full <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link> and <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </>
  );
};

export default FooterLegal;