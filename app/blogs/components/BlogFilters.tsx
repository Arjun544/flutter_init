'use client'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'

const MONTHS_LIST = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

interface BlogFiltersProps {
  categories: string[]
  years: string[]
  currentFilters: {
    kind: string
    category: string
    year: string
    month: string
    sort: string
  }
}

export function BlogFilters({
  categories,
  years,
  currentFilters,
}: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { kind, category, year, month, sort } = currentFilters

  const hasActiveFilters =
    kind !== 'all' ||
    category !== 'all' ||
    year !== 'all' ||
    month !== 'all' ||
    sort !== 'desc'

  const updateFilters = (newFilters: Partial<typeof currentFilters>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    
    // Always reset page to 1 on filter changes
    params.set('page', '1')

    Object.entries({ ...currentFilters, ...newFilters }).forEach(([key, value]) => {
      if (value && value !== 'all' && !(key === 'sort' && value === 'desc')) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Kind Filter Tabs & Sort Select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <Tabs
          value={kind}
          onValueChange={(val) => updateFilters({ kind: val })}
        >
          <TabsList>
            {[
              { value: 'all', label: 'All Posts' },
              { value: 'guide', label: 'Guides' },
              { value: 'update', label: 'Updates' },
            ].map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className='min-w-26'
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-zinc-500">Sort:</span>
          <Select
            value={sort}
            onValueChange={(val) => updateFilters({ sort: val })}
          >
            <SelectTrigger size="sm" className="h-9 min-w-[140px] text-xs bg-white border-zinc-200 rounded-lg hover:border-zinc-300">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Select Dropdowns & Clear Button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(val) => updateFilters({ category: val })}
        >
          <SelectTrigger size="sm" className="h-9 min-w-[150px] text-xs bg-white border-zinc-200 rounded-lg hover:border-zinc-300">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={year}
          onValueChange={(val) => updateFilters({ year: val })}
        >
          <SelectTrigger size="sm" className="h-9 min-w-[110px] text-xs bg-white border-zinc-200 rounded-lg hover:border-zinc-300">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month Filter */}
        <Select
          value={month}
          onValueChange={(val) => updateFilters({ month: val })}
        >
          <SelectTrigger size="sm" className="h-9 min-w-[120px] text-xs bg-white border-zinc-200 rounded-lg hover:border-zinc-300">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTHS_LIST.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-9 gap-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-all text-xs cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} className="shrink-0" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
