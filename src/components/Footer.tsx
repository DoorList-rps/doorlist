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
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
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
              <li><a href="/disclosures" className="text-gray-400 hover:text-white transition-colors">Disclosures</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DoorList. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;