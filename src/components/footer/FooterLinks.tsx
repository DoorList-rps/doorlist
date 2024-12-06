import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks = () => {
  return (
    <>
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
          <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Resources</h4>
        <ul className="space-y-2">
          <li><Link to="/investments" className="text-gray-400 hover:text-white transition-colors">Investments</Link></li>
          <li><Link to="/sponsors" className="text-gray-400 hover:text-white transition-colors">Sponsors</Link></li>
          <li><Link to="/education" className="text-gray-400 hover:text-white transition-colors">Education</Link></li>
          <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
          <li><Link to="/calculator" className="text-gray-400 hover:text-white transition-colors">Investment Calculator</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
    </>
  );
};

export default FooterLinks;