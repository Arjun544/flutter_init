import { WizardShell } from "@/app/components/wizard/WizardShell"
import { WizardProvider } from "@/app/lib/state/useWizardStore"
import Image from "next/image"

export default function Page() {
    return (
        <WizardProvider>
            <div className="relative">
                <header className="absolute top-0 left-0 z-50 w-full p-6 flex justify-center items-center gap-4 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-3 bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border/40 shadow-sm">
                        <Image
                            src="/logo.svg"
                            alt="Flutter Init Logo"
                            width={32}
                            height={32}
                            className="h-12 w-12"
                        />
                    </div>
                </header>
                <WizardShell />
            </div>
        </WizardProvider>
    )
}