import { CodeEditorWorkspace } from "@/app/components/wizard/CodeEditorWorkspace"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Preview — FlutterInit",
  description: "Browse your generated Flutter scaffold in a VS Code–style editor.",
  alternates: {
    canonical: "https://flutterinit.com/create/code",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function CreateCodePage() {
  return <CodeEditorWorkspace />
}
