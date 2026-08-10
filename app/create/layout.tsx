import { WizardProvider } from "@/app/lib/state/useWizardStore"

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WizardProvider>{children}</WizardProvider>
}
