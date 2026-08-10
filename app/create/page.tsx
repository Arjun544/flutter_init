import { WizardShell } from "@/app/components/wizard/WizardShell"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Your Flutter Project",
  description:
    "Configure and generate your custom Flutter project scaffold in seconds. Choose your architecture, state management, and more.",
  alternates: {
    canonical: "https://flutterinit.com/create",
  },
}

export default function CreatePage() {
  return <WizardShell />
}
