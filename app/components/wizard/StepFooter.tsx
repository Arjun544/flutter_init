import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

export function StepFooter({
    onPrev,
    onNext,
}: {
    onPrev?: () => void
    onNext?: () => void
}) {
    return (
        <CardContent className="flex items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4 backdrop-blur-sm">
            <Button
                variant="ghost"
                onClick={onPrev}
                disabled={!onPrev}
                className="hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all"
            >
                Back
            </Button>
            <Button
                onClick={onNext}
                disabled={!onNext}
                className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-medium"
            >
                Continue
            </Button>
        </CardContent>
    )
}
