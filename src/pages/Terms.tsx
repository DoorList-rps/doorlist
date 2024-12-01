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
          
          <p>
            Welcome to DoorList ("we," "our," or "us"). These Terms and Conditions govern your use of our website, [Doorlist.com] (the "Website"). 
            By accessing or using our Website, you agree to these Terms and Conditions. If you disagree with any part, please do not use our Website.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Website, you agree to abide by these Terms and Conditions, as well as our Privacy Policy, 
            which governs our data practices.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Website or, if under 18, have parental or guardian permission. 
            By accessing the Website, you affirm that you are eligible and agree to comply with these Terms.
          </p>

          <h2>3. Intellectual Property Rights</h2>
          <p>
            All content, trademarks, service marks, logos, and other intellectual property displayed on the Website are the property 
            of Doorlist.com or its licensors. You may not reproduce, distribute, modify, or create derivative works without prior 
            written permission from us. You are granted a limited license solely for personal, non-commercial use.
          </p>

          <h2>4. User Accounts and Responsibilities</h2>
          <ul>
            <li>If you create an account on our Website, you are responsible for maintaining the confidentiality of your account credentials. 
                You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>You are responsible for all activities that occur under your account and must ensure that any data you provide is accurate 
                and up to date.</li>
            <li>We reserve the right to suspend or terminate your account for any violation of these Terms.</li>
          </ul>

          <h2>5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Website for any illegal purpose or in violation of any applicable law.</li>
            <li>Attempt to gain unauthorized access to our systems, servers, or data.</li>
            <li>Interfere with the operation or security of the Website, including by distributing viruses, spam, or malicious content.</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by U.S. law:</p>
          <ul>
            <li>Doorlist.com shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out 
                of your use or inability to use the Website.</li>
            <li>Our total liability to you shall not exceed the amount paid by you, if any, for accessing the Website.</li>
          </ul>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Website is provided on an "as-is" and "as available" basis. We disclaim all warranties of any kind, whether express or 
            implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. 
            We do not guarantee that the Website will be available at all times or error-free.
          </p>

          <h2>8. Links to Third-Party Websites</h2>
          <p>
            Our Website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of such sites. 
            Links do not imply endorsement, and we recommend you review the terms and policies of any third-party websites you visit.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Doorlist.com, its affiliates, employees, and agents from any claims, liabilities, damages, 
            losses, or expenses arising from your use of the Website or violation of these Terms.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may modify these Terms and Conditions at any time. Updated terms will be posted on this page with an "Updated" date. 
            Your continued use of the Website constitutes acceptance of any modified terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by the laws of the State of Wyoming, United States, without regard to conflict of laws principles. 
            Any disputes arising out of or relating to these Terms shall be resolved exclusively in the courts of Wyoming.
          </p>

          <h2>12. Dispute Resolution</h2>
          <p>
            In the event of a dispute, you agree to first attempt to resolve it by contacting us directly. If resolution fails, 
            you agree to binding arbitration in Wyoming, except where prohibited by law.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:contact@doorlist.com">contact@doorlist.com</a></li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;