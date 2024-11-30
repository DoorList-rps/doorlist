import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Terms of Service</h1>
          
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using DoorList, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2>Investment Risks</h2>
          <p>
            All investments carry risk. Past performance is not indicative of future results. You should carefully consider your investment objectives and risks before investing.
          </p>

          <h2>User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            DoorList shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;