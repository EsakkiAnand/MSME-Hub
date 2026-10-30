import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '@/components/home/HeroSection';
import { LiveTickerSection } from '@/components/home/LiveTickerSection';
import { DiagnosticToolSection } from '@/components/home/DiagnosticToolSection';
import { AboutSection } from '@/components/home/AboutSection';
import { WorkflowSection } from '@/components/home/WorkflowSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { LabsSection } from '@/components/home/LabsSection';
import { SuccessStoriesSection } from '@/components/home/SuccessStoriesSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="w-full">
      <HeroSection />
      <LiveTickerSection />
      <DiagnosticToolSection />
      <AboutSection />
      <WorkflowSection />
      <CategoriesSection />
      <LabsSection />
      <SuccessStoriesSection />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
