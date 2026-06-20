import type { StackConfig } from '@/lib/blog/types'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Layers01Icon,
  FlashIcon,
  Database01Icon,
  GitForkIcon,
} from '@hugeicons/core-free-icons'

const ARCH_LABELS: Record<StackConfig['architecture'], string> = {
  clean: 'Clean Architecture',
  mvvm: 'MVVM',
  'feature-first': 'Feature-First',
}

const STATE_LABELS: Record<StackConfig['stateManagement'], string> = {
  riverpod: 'Riverpod',
  bloc: 'Bloc',
  provider: 'Provider',
  getx: 'GetX',
  signals: 'Signals',
}

const BACKEND_LABELS: Record<StackConfig['backend'], string> = {
  firebase: 'Firebase',
  supabase: 'Supabase',
  appwrite: 'Appwrite',
  none: 'No Backend',
}

const NAV_LABELS: Record<StackConfig['navigation'], string> = {
  go_router: 'go_router',
  auto_route: 'auto_route',
  none: 'No Navigation Package',
}

interface Field {
  icon: any
  label: string
  value: string
  colorClass: string
}

function buildFields(config: StackConfig): Field[] {
  return [
    {
      icon: Layers01Icon,
      label: 'Architecture',
      value: ARCH_LABELS[config.architecture],
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      icon: FlashIcon,
      label: 'State Management',
      value: STATE_LABELS[config.stateManagement],
      colorClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
    },
    {
      icon: Database01Icon,
      label: 'Backend',
      value: BACKEND_LABELS[config.backend],
      colorClass: 'bg-orange-50 text-orange-700 border-orange-200/80',
    },
    {
      icon: GitForkIcon,
      label: 'Navigation',
      value: NAV_LABELS[config.navigation],
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
  ]
}

interface GuideConfigBlockProps {
  stackConfig: StackConfig
}

export function GuideConfigBlock({ stackConfig }: GuideConfigBlockProps) {
  const fields = buildFields(stackConfig)

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="border-b border-zinc-200/80 px-5 py-3.5">
        <p className="text-[13px] font-semibold text-zinc-700">
          Stack Configuration — what FlutterInit generates for this guide
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-zinc-200/60 sm:grid-cols-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-2 bg-white px-4 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {field.label}
            </span>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={field.icon}
                size={16}
                strokeWidth={2}
                className="text-zinc-500 shrink-0"
              />
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${field.colorClass}`}
              >
                {field.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

