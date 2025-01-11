import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Privacy Policy | DoorList</title>
        <meta name="description" content="Learn about DoorList's commitment to protecting your privacy and how we handle your personal information." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            DoorList ("we," "us," or "our") respects your privacy and is committed to protecting it through our compliance with this Privacy Policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website Doolist.com, in compliance with the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA). Please read this policy carefully to understand our views and practices regarding your personal data and how we treat it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect and process the following types of information about you:</p>
          <ul>
            <li><strong>Personal Identifiable Information (PII):</strong> Name, email address, phone number, and other contact details.</li>
            <li><strong>Automatically Collected Information:</strong> Information about your device, IP address, and browsing patterns, collected through cookies and similar tracking technologies.</li>
            <li><strong>Usage Data:</strong> Details of your visits to our website, including traffic data, location data, and other communication data.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>To provide, operate, and maintain our website.</li>
            <li>To improve our website and user experience.</li>
            <li>To communicate with you, including sending you emails about updates, offers, or other information that may be relevant.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
          </ul>

          <h2>3. Sharing of Your Information</h2>
          <p>We may share your personal data in the following situations:</p>
          <ul>
            <li>With third-party service providers that perform services on our behalf (e.g., analytics providers, payment processors).</li>
            <li>To comply with legal obligations or protect our rights and interests.</li>
            <li>With your consent, when necessary or permitted by law.</li>
          </ul>

          <h2>4. Your Rights Under GDPR</h2>
          <p>If you are located in the European Economic Area (EEA), you have certain rights regarding your personal data, including:</p>
          <ul>
            <li><strong>Right to Access:</strong> You can request a copy of your personal data.</li>
            <li><strong>Right to Rectification:</strong> You can request that we correct any incomplete or inaccurate information.</li>
            <li><strong>Right to Erasure:</strong> You can request that we delete your personal data, subject to certain legal exceptions.</li>
            <li><strong>Right to Restriction of Processing:</strong> You can request that we limit our processing of your data.</li>
            <li><strong>Right to Data Portability:</strong> You can request to receive your personal data in a structured, commonly used, and machine-readable format.</li>
            <li><strong>Right to Object:</strong> You have the right to object to our processing of your data under certain conditions.</li>
          </ul>

          <h2>5. Your Rights Under CCPA</h2>
          <p>If you are a California resident, you have additional rights regarding your personal data:</p>
          <ul>
            <li><strong>Right to Know:</strong> You can request that we disclose what personal information we collect, use, disclose, and sell.</li>
            <li><strong>Right to Delete:</strong> You can request that we delete your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information. If this changes, you will have the right to opt-out.</li>
            <li><strong>Right to Non-Discrimination:</strong> You have the right to non-discriminatory treatment for exercising your privacy rights.</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:contact@doorlist.com">contact@doorlist.com</a>.</p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data from accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
          </p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, your personal data, or if you wish to exercise your rights, please contact us using the information below:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:contact@doorlist.com">contact@doorlist.com</a></li>
          </ul>
          <p>
            We are here to help and will respond to your inquiries as promptly as possible.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
