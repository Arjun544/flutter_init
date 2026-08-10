import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | FlutterInit Blog',
    default: 'Blogs | FlutterInit',
  },
  description: 'Updates, guides, and deep-dives on Flutter architecture, state management, and backend integrations.',
}

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
