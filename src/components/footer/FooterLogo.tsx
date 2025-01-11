import React from 'react';
import { Link } from 'react-router-dom';

const FooterLogo = () => {
  return (
    <div>
      <Link to="/" aria-label="Return to Homepage">
        <img src="/lovable-uploads/57591e9e-a8d6-4180-b51a-6b8bdabb29fb.png" alt="DoorList Logo" className="h-40 mb-4" />
      </Link>
      <p className="text-gray-400">
        <Link to="/" className="hover:text-white transition-colors">
          Access institutional-quality real estate investments
        </Link>
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
  );
};

export default FooterLogo;