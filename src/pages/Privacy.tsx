import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including when you create an account, express interest in an investment opportunity, or communicate with us.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to communicate with you about investment opportunities, and to comply with legal obligations.
          </p>

          <h2>Information Sharing</h2>
          <p>
            We may share your information with investment sponsors when you express interest in their opportunities, and with service providers who assist in operating our platform.
          </p>

          <h2>Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;