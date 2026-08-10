import { CodeEditorWorkspace } from "@/app/components/wizard/CodeEditorWorkspace"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Preview — FlutterInit",
  description: "Browse your generated Flutter scaffold in a VS Code–style editor.",
}

export default function CreateCodePage() {
  return <CodeEditorWorkspace />
}
