import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Frequently Asked Questions | DoorList</title>
        <meta name="description" content="Find answers to common questions about real estate investing, DoorList's platform, and how to get started with institutional-quality investments." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 mb-8">Got a question? We've got answers.</p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">What's DoorList's goal?</AccordionTrigger>
              <AccordionContent>
                Our goal is to connect potential investors with opportunities to invest in private real estate funds and syndications. These opportunities have long been hard to find and exclusive to a select few. We want to be the most comprehensive source for real estate investing in the market.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Who is DoorList's intended audience?</AccordionTrigger>
              <AccordionContent>
                Real estate investing hasn't always been approachable for most Americans. It's why only 7% percent of the population owns income-producing real estate, but 57% own stocks. DoorList allows everyone to learn about passive real estate investment opportunities giving them more confidence to invest.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">Is DoorList free?</AccordionTrigger>
              <AccordionContent>
                Accessing DoorList's marketplace is free. We welcome everyone to browse the marketplace and identify Sponsor and investment opportunities you may be interested in.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">How do you identify Sponsors and Investments?</AccordionTrigger>
              <AccordionContent>
                We've spent years carefully researching, reviewing, and building out our database to identify Sponsors who are transparent, have significant track records, and who make passive investing in commercial real estate easy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold">What's the next step after identifying an investment opportunity I am interested in?</AccordionTrigger>
              <AccordionContent>
                Indicate your interest in a sponsor or investment by clicking "I'm Interested". DoorList will connect you with the Sponsor so you can further vet the opportunity and ask the sponsor questions about their experience, track record, previous deals/funds, and what to expect as a Limited Partner (LP).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
