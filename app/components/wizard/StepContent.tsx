import { StepId } from "@/app/lib/config/schema"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const BasicsStep = dynamic(() => import("./steps/BasicsStep").then(m => m.BasicsStep), { loading: () => <StepSkeleton /> })
const ThemeStep = dynamic(() => import("./steps/ThemeStep").then(m => m.ThemeStep), { loading: () => <StepSkeleton /> })
const IconsStep = dynamic(() => import("./steps/IconsStep").then(m => m.IconsStep), { loading: () => <StepSkeleton /> })
const ArchitectureStep = dynamic(() => import("./steps/ArchitectureStep").then(m => m.ArchitectureStep), { loading: () => <StepSkeleton /> })
const StateStep = dynamic(() => import("./steps/StateStep").then(m => m.StateStep), { loading: () => <StepSkeleton /> })
const NavigationStep = dynamic(() => import("./steps/NavigationStep").then(m => m.NavigationStep), { loading: () => <StepSkeleton /> })
const BackendStep = dynamic(() => import("./steps/BackendStep").then(m => m.BackendStep), { loading: () => <StepSkeleton /> })
const LocalizationStep = dynamic(() => import("./steps/LocalizationStep").then(m => m.LocalizationStep), { loading: () => <StepSkeleton /> })
const MiscStep = dynamic(() => import("./steps/MiscStep").then(m => m.MiscStep), { loading: () => <StepSkeleton /> })
const GenerateStep = dynamic(() => import("./steps/GenerateStep").then(m => m.GenerateStep), { loading: () => <StepSkeleton /> })

function StepSkeleton() {
    return (
        <div className="space-y-4 w-full">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
    )
}

export function StepContent({ step, error, isGenerating }: { step: StepId, error: string | null, isGenerating: boolean }) {
    switch (step) {
        case "basics":
            return <BasicsStep />
        case "theme":
            return <ThemeStep />
        case "icons":
            return <IconsStep />
        case "architecture":
            return <ArchitectureStep />
        case "state":
            return <StateStep />
        case "navigation":
            return <NavigationStep />
        case "backend":
            return <BackendStep />
        case "localization":
            return <LocalizationStep />
        case "misc":
            return <MiscStep />
        case "generate":
        default:
            return <GenerateStep error={error} isGenerating={isGenerating} />
    }
}

