const Footer = () => {
  return (
    <footer className="bg-doorlist-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <img src="/lovable-uploads/57591e9e-a8d6-4180-b51a-6b8bdabb29fb.png" alt="DoorList Logo" className="h-8 mb-4" />
            <p className="text-gray-400">
              Access institutional-quality real estate investments
            </p>
            <div className="mt-4">
              <a 
                href="https://x.com/DoorList_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow us on X
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/investments" className="text-gray-400 hover:text-white transition-colors">Investments</a></li>
              <li><a href="/sponsors" className="text-gray-400 hover:text-white transition-colors">Sponsors</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
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
            For further details, please refer to the full <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</a> and <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;