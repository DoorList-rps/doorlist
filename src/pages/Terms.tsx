import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Terms of Service | DoorList</title>
        <meta name="description" content="Review DoorList's terms of service and understand our platform's rules and guidelines." />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-doorlist-navy mb-8">Terms of Service</h1>
          
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6">
            <p>
              You should read this Terms of Service Agreement (this "Agreement") carefully before accessing or using the website located at <a href="https://www.doorlist.com" className="text-doorlist-navy hover:text-doorlist-navy/80">www.doorlist.com</a> (including all subdomains and related content, the "Site"), or any of the related services (collectively, the "Services") provided by DoorList LLC ("DoorList," "we," or "us"). The Services include, without limitation, providing access to investment opportunities presented by the managers who list their opportunities on the Site or otherwise use DoorList's Services, providing access to offering documents and due diligence materials relating to those opportunities, capital raising and marketing services, and any interactions with investors or potential investors accessing investment opportunities through or otherwise using the Site or any of the Services. This Agreement constitutes a contract between you and DoorList, in addition to any other written agreements between us.
            </p>

            <p>
              This Agreement applies to all users of the Services, including investors who use the Services to research and make investments, and qualified issuers, managers, and investment managers who use the Site or the Services to make their offerings available to investors, and all managers who engage DoorList to provide capital raise or related services (collectively, "Users," each of which may be referred to in this Agreement as "you"). "Users" includes anyone who accesses or uses the Site or the Services for any reason.
            </p>

            <p>
              By accessing the Site or using the Services, you acknowledge that you have read and understand, and agree to be bound by, this Agreement. We may update this Agreement at any time. Your continued use of the Services or the Site after any modifications to this Agreement constitutes your acceptance of the modified terms and conditions. If you do not accept this Agreement, including any modifications to this Agreement, you do not have permission to access, browse, or use the Services or the Site, and your sole and exclusive remedy is to discontinue using them. As such, we strongly recommend that you periodically review this Agreement, which is available upon request or at https://doorlist.com/terms. The date of the last revision of this Agreement appears at the top of the Agreement under the title. The latest revision of this Agreement supersedes and replaces all prior versions.
            </p>

            <p>
              Your compliance with this Agreement is a condition of your right to access the Site and use the Services. Your breach of any provision of this Agreement will automatically, without the requirement of notice or of any other action, revoke and terminate your right to use the Services or access the Site and may also entitle us to recover damages from you.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Privacy Policy and Data Usage</h2>
            <p>
              For information on how DoorList collects, uses, and discloses information obtained from its Users, please review our Privacy Policy, which is available at https://doorlist.com/privacy. Your use of the Site or the Services indicates your consent to the data practices stated in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Manager Profiles and Opportunity Listings</h2>
            <p>
              The Site includes information about real estate fund investment managers and their investment opportunities that DoorList agrees to post on the Site as part of the Services, including summaries and other descriptions of the business terms of each investment opportunity that have been written and provided by the manager listing that opportunity—not by DoorList. Among other things, DoorList may post information about a manager's track record, total assets under management, target return profiles for any specific opportunity, and summaries of investment opportunities on the Site. All of this information and any similar information is provided primarily by the managers, and each manager is ultimately responsible for the content of all information included in that manager's profile and opportunity listings. While DoorList may conduct some due diligence concerning that information, as described on the Site, it makes no independent effort to confirm all the information included in each manager profile or opportunity listing and expressly disclaims any representation or warranty that the information is accurate. Users of the Site are required to undertake their own, independent efforts to verify any of the information on the Site before making an investment.
            </p>

            <p>
              All information on the Site is intended for informational purposes only and does not purport to be complete. Each investment opportunity summary is qualified in its entirety by reference to the more detailed discussions contained in the applicable investor offering documents provided solely by the manager. No information about open opportunities available on the Site should be relied upon by Users making an investment. The Services include neither financial advice nor tailored recommendations and do not consider any specific User's investment requirements or financial situation. Potential investors should consult with their professional tax, legal, and financial advisors before making any investment.
            </p>

            <p>
              DoorList retains all rights to edit or delete any content on the Site in its sole discretion.
            </p>

            <p className="bg-gray-100 p-4 my-6 font-semibold">
              IN ADDITION TO THE MORE GENERAL DISCLAIMERS CONTAINED ELSEWHERE IN THESE TERMS, DOORLIST EXPRESSLY DISCLAIMS ANY AND ALL LIABILITY RELATING TO ANY INFORMATION PRESENTED ABOUT A MANAGER'S PRIOR PERFORMANCE, TOTAL ASSETS UNDER MANAGEMENT, AND TARGET RETURN PROFILES, AS WELL AS THE PERFORMANCE OF ANY INVESTMENT OPPORTUNITIES DESCRIBED ON THE SITE. MANAGERS OFFERING INVESTMENT OPPORTUNITIES ON THE SITE ARE SOLELY AND EXCLUSIVELY RESPONSIBLE FOR THE REPRESENTATIONS ON THE SITE ABOUT THE OPPORTUNITIES BEING PRESENTED. LISTING AN OPEN OPPORTUNITY ON THE SITE OR OTHERWISE PROVIDING INFORMATION TO INVESTORS ABOUT A MANAGER OR AN INVESTMENT OPPORTUNITY DOES NOT CONSTITUTE AN ENDORSEMENT OR RECOMMENDATION OF THE MANAGER OFFERING THAT OPPORTUNITY OR OF THE OPPORTUNITY ITSELF. DOORLIST UNDERTAKES NO OBLIGATION TO UNDERWRITE, APPROVE, OR REVIEW ANY LISTED OPPORTUNITY. DOORLIST SPECIFICALLY DISCLAIMS ANY AND ALL REPRESENTATIONS OR WARRANTIES ABOUT ANY OF THE INFORMATION AND ANY OF THE OPEN OPPORTUNITIES LISTED ON THE SITE OTHER THAN THE EXPRESS REPRESENTATIONS INCLUDED IN THESE TERMS OF SERVICE.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">No Legal Advice, Investment Advice or Recommendations Provided; Securities Involve a High Degree of Risk</h2>
            <p>
              DoorList is not a law firm, registered broker-dealer, funding portal, or investment advisor, and does not conduct any activity that would require professional licensing or regulatory registration. Through the Site, DoorList provides information about investment opportunities and the managers of those opportunities. DoorList, however, does not (and cannot) offer any investment advice, and it does not recommend or endorse any of the managers who use the Services or any of the investment opportunities posted on the Site. By listing open investment opportunities on the Site, DoorList is not recommending investing in any one or more of those opportunities—it is allowing managers to provide the information solely to make accredited and otherwise qualified investors aware of potential opportunities. <strong>ALL INVESTOR USERS MUST CONDUCT THEIR OWN DUE DILIGENCE AND SHOULD CONSULT WITH COMPETENT LEGAL AND FINANCIAL ADVISORS BEFORE INVESTING IN ANY OPPORTUNITIES OR WITH ANY MANAGERS THEY MAY FIND ON THE SITE.</strong>
            </p>

            <p>
              None of the securities described on the Site have been registered under the Securities Act, and all are being advertised by their respective sponsor or manager in reliance on certain exemptions provided in Section 4(2) of the Securities Act and Regulation D, Rule 506, and Regulation S, promulgated under the Securities Act. Securities sold through private placements, including those listed on the Site, are restricted and not publicly traded, and are therefore illiquid. All private investments, including those listed on the Site, involve risk and uncertainty, including lower-than-projected returns and a complete loss of invested capital. The investment opportunities identified on the Site are intended solely for experienced, qualified investors. Investors who cannot afford to lose their entire investment should not invest in private offerings like those listed on this Site.
            </p>

            <p>
              Neither the U.S. Securities and Exchange Commission nor any state securities commission or other regulatory authority has approved, passed upon, or endorsed the merits of any offering on the Site, and DoorList is not registered with or subject to the supervision of any of those entities.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Investor Due Diligence</h2>
            <p className="bg-gray-100 p-4 my-6 font-semibold">
              BY USING THE SERVICES AND THE SITE TO RESEARCH OR MAKE INVESTMENTS IN PRIVATE SECURITIES ISSUED OR MANAGED BY OTHER USERS, YOU ACKNOWLEDGE AND AGREE THAT ALL SUCH INVESTMENTS ARE INHERENTLY RISKY, AND YOU ARE ASSUMING ALL RISKS ASSOCIATED WITH MAKING SUCH AN INVESTMENT. YOU ACKNOWLEDGE THAT DOORLIST AND ITS AFFILIATED COMPANIES WILL ONLY CONDUCT LIMITED DILIGENCE ACTIVITIES PRIOR TO INCLUDING A MANAGER OR AN INVESTMENT OPPORTUNITY ON THE SITE, AND THAT ANY ACTIVITIES DOORLIST MAY HAVE PERFORMED MIGHT BE FLAWED, DATED, OR INACCURATE, OR MAY FOR A VARIETY OF REASONS BE UNRELATED TO ANY DUE DILIGENCE YOU MAY NEED TO DO TO SAFELY MAKE SUCH AN INVESTMENT FOR YOUR PURPOSES. YOU ALSO ACKNOWLEDGE THAT YOU HAVE NO RIGHT TO RELY SOLELY ON ACTIVITIES THAT DOORLIST OR ITS AFFILIATES HAVE DONE IN MAKING YOUR INVESTMENT DECISIONS. YOU WILL CONDUCT YOUR OWN DUE DILIGENCE ON ALL OPPORTUNITIES IN WHICH YOU MAY BE INTERESTED.
            </p>

            <p className="bg-gray-100 p-4 my-6 font-semibold">
              BY USING THE SERVICES, YOU UNCONDITIONALLY AND FOREVER RELEASE DOORLIST AND ITS AFFILIATES AND THEIR RESPECTIVE AGENTS, OFFICERS, DIRECTORS, PARTNERS, REPRESENTATIVES, AND THIRD-PARTY SERVICE PROVIDERS FROM ANY AND ALL LIABILITY ASSOCIATED WITH YOUR USE OF THE SERVICES, INCLUDING THE SITE, AND ANY INFORMATION PROVIDED BY OTHER USERS, EVEN IN THE EVENT OF OUTRIGHT FRAUD BY PARTIES OTHER THAN DOORLIST, WHETHER OR NOT IT COULD HAVE REASONABLY BEEN KNOWN OR FORESEEN AT THE TIME OF INCEPTION OR AT ANY TIME THEREAFTER.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimers</h2>
            <p className="bg-gray-100 p-4 my-6 font-semibold">
              THE SERVICES AND THE SITE ARE PROVIDED TO YOU ON AN "AS IS" AND "AS AVAILABLE" BASIS WITH NO WARRANTIES OF ANY KIND, EXCEPT FOR THE EXPRESS, LIMITED REPRESENTATIONS AND WARRANTIES MADE IN THIS AGREEMENT. BY USING THE SERVICES, YOU EXPRESSLY AGREE THAT SUCH USE IS AT YOUR SOLE RISK. NEITHER DOORLIST NOR ANY OF ITS AFFILIATES OR THEIR RESPECTIVE OFFICERS, DIRECTORS, PARTNERS, MEMBERS, EMPLOYEES, AGENTS, THIRD-PARTY CONTENT PROVIDERS (OTHER THAN USERS PROVIDING USER CONTENT THAT INCLUDES EXPRESS REPRESENTATIONS), DESIGNERS, CONTRACTORS, DISTRIBUTORS, MERCHANTS, LICENSORS OR THE LIKE (COLLECTIVELY "REPRESENTATIVES") WARRANT THAT THE USE OF THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE. EXCEPT FOR THE EXPRESS, LIMITED REPRESENTATIONS AND WARRANTIES MADE IN THIS AGREEMENT, NEITHER DOORLIST NOR ITS REPRESENTATIVES MAKE ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, AND DOORLIST AND ITS REPRESENTATIVES HEREBY DISCLAIM ANY AND ALL SUCH WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, TITLE, AND NON-INFRINGEMENT, ALL TO THE FULLEST EXTENT PERMITTED BY LAW.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
