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
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is DoorList?</AccordionTrigger>
              <AccordionContent>
                DoorList is a platform that connects investors with institutional-quality real estate investment opportunities from experienced sponsors. We make it easier for investors to access and invest in professionally managed real estate deals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Who can invest through DoorList?</AccordionTrigger>
              <AccordionContent>
                Most investment opportunities on DoorList are available to accredited investors. Some opportunities may be available to non-accredited investors. Each investment opportunity will clearly state its investor requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What is the minimum investment amount?</AccordionTrigger>
              <AccordionContent>
                Minimum investment amounts vary by opportunity. Each investment opportunity will clearly state its minimum investment requirement. We work with sponsors to provide opportunities with lower minimums when possible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How does DoorList select sponsors?</AccordionTrigger>
              <AccordionContent>
                We carefully vet each sponsor on our platform, reviewing their track record, experience, and investment strategy. We only work with established sponsors who have a proven history of successful real estate investments.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                You can browse available investment opportunities on our platform. When you find an opportunity you're interested in, you can contact us through the platform to learn more and begin the investment process.
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