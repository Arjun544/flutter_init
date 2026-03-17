import { WizardShell } from "@/app/components/wizard/WizardShell"
import { WizardProvider } from "@/app/lib/state/useWizardStore"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Your Flutter Project",
  description: "Configure and generate your custom Flutter project scaffold in seconds. Choose your architecture, state management, and more.",
};

export default function CreatePage() {
    return (
        <WizardProvider>
            <WizardShell />
        </WizardProvider>
    )
}
