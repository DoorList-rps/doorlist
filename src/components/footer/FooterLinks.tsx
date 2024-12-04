import React from 'react';

const FooterLinks = () => {
  return (
    <>
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
          <li><a href="/education" className="text-gray-400 hover:text-white transition-colors">Education</a></li>
          <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
          <li><a href="/calculator" className="text-gray-400 hover:text-white transition-colors">Investment Calculator</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
        </ul>
      </div>
    </>
  );
};

export default FooterLinks;