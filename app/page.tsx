import { MarketingLayout } from '@/components/MarketingLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AppMockupSection } from '@/components/landing/AppMockupSection';
import { PricingSection } from '@/components/landing/PricingSection';

export default function ContaMindLanding() {
  return (
    <MarketingLayout>
      <HeroSection />
      <FeaturesSection />
      <AppMockupSection />
      <PricingSection />
    </MarketingLayout>
  );
}
