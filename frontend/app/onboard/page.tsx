import { OnboardingWizard } from "@/components/onboard/OnboardingWizard";

export const metadata = {
  title: "Onboarding — OptiWealth",
  description: "Frictionless 3-step financial profile capture wizard",
};

export default function OnboardPage() {
  return <OnboardingWizard />;
}