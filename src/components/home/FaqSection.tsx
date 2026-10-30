import { useState } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does submitting a problem obligate our enterprise to a financial commitment?',
      a: 'No. The 1-minute G0 submission and preliminary technical screening by the Hub Coordinator (Gate G1) are completely free and non-binding. If a physical prototype requires raw materials or specialized tooling, funding is typically sought through Government of India / Tamil Nadu schemes (EDII IVP, MSME Idea Hackathon, ASPIRE) or defined in a mutually agreed Project Charter before substantive lab work commences.',
    },
    {
      q: 'How does Francis Xavier Engineering College safeguard our proprietary trade secrets?',
      a: 'We adhere strictly to institutional academic non-disclosure protocols. You are expressly advised NOT to disclose secret formulations, customer drawings, or patentable trade secrets in the initial intake form. Once an engagement is assessed and approved for on-site diagnostic visit (Gate G3), an institutional Non-Disclosure Agreement (NDA) is executed between FXEC and your enterprise.',
    },
    {
      q: 'Who actually works on our shopfloor engineering challenge?',
      a: 'Approved projects are assigned an interdisciplinary project squad comprised of selected 3rd and Final-Year engineering students (Mechanical, EEE, ECE, CSE, IT, AI) led by an experienced PhD Faculty Principal Investigator. The squad utilizes FXEC research centers for fabrication and testing.',
    },
    {
      q: 'What is the typical timeline from submission to preliminary feedback?',
      a: 'The Hub Coordinator reviews submissions within 48 to 72 business hours (Gate G1). If the challenge is viable and falls within our technical domains, a field visit or technical scoping session (Gate G3) is scheduled within 5 to 7 working days.',
    },
    {
      q: 'What happens to the Intellectual Property (IP) developed during the project?',
      a: 'IP ownership terms are clearly stipulated in the Project Charter (Gate G5). Typically, inventions can be jointly filed with our FXEC IPR Cell, or full commercial exploitation rights are assigned to the enterprise based on the agreed sponsorship framework.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <SectionHeading
          badge="Procedural Clarifications"
          title="Frequently Addressed Questions by"
          highlight="Enterprise Partners"
          description="Institutional guidelines regarding academic non-disclosure, government incubation subsidies, intellectual property, and laboratory protocols."
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  'rounded-lg border transition-all overflow-hidden',
                  isOpen
                    ? 'border-blue-900 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer gap-4"
                >
                  <span className="font-bold text-slate-900 text-sm">
                    {faq.q}
                  </span>
                  <div
                    className={cn(
                      'h-6 w-6 rounded flex items-center justify-center shrink-0 transition-transform duration-200',
                      isOpen ? 'bg-blue-900 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
