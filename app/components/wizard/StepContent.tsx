import { StepId } from "@/app/lib/config/schema"
import { ArchitectureStep } from "./steps/ArchitectureStep"
import { BackendStep } from "./steps/BackendStep"
import { BasicsStep } from "./steps/BasicsStep"
import { ExtrasStep } from "./steps/ExtrasStep"
import { GenerateStep } from "./steps/GenerateStep"
import { NavigationStep } from "./steps/NavigationStep"
import { PackagesStep } from "./steps/PackagesStep"
import { StateStep } from "./steps/StateStep"
import { ThemeStep } from "./steps/ThemeStep"

export function StepContent({ step }: { step: StepId }) {
    switch (step) {
        case "basics":
            return <BasicsStep />
        case "theme":
            return <ThemeStep />
        case "architecture":
            return <ArchitectureStep />
        case "state":
            return <StateStep />
        case "navigation":
            return <NavigationStep />
        case "backend":
            return <BackendStep />
        case "packages":
            return <PackagesStep />
        case "extras":
            return <ExtrasStep />
        case "generate":
        default:
            return <GenerateStep />
    }
}
