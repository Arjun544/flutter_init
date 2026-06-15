'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'

type As = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'

type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text: string
  as?: As
}

const LETTER_REST: React.CSSProperties = {
  display: 'inline-block',
  fontOpticalSizing: 'auto' as never,
  willChange: 'font-weight, padding',
  transition: 'font-weight 0.4s, -webkit-text-stroke-color 0.4s, padding 0.4s',
  WebkitTextStrokeColor: 'transparent',
  paddingInline: '0',
}

function getLetterStyle(
  i: number,
  hoveredIndex: number | null,
  strokeWidth: string,
  hoverPadding: string,
): React.CSSProperties {
  // Resting state: inherit font-weight from CSS (parent class controls the base weight)
  if (hoveredIndex === null) {
    return { ...LETTER_REST, WebkitTextStrokeWidth: strokeWidth }
  }

  const dist = Math.abs(i - hoveredIndex)

  if (dist === 0) {
    return {
      ...LETTER_REST,
      fontWeight: 900,
      WebkitTextStrokeColor: 'currentcolor',
      WebkitTextStrokeWidth: `calc(${strokeWidth} * 2)`,
      paddingInline: hoverPadding,
    }
  }
  if (dist === 1) {
    return {
      ...LETTER_REST,
      fontWeight: 600,
      WebkitTextStrokeWidth: strokeWidth,
      paddingInline: hoverPadding,
    }
  }
  if (dist === 2) {
    return {
      ...LETTER_REST,
      fontWeight: 400,
      WebkitTextStrokeWidth: strokeWidth,
    }
  }

  // dist > 2: also inherit — no inline fontWeight, CSS class applies
  return { ...LETTER_REST, WebkitTextStrokeWidth: strokeWidth }
}

export function KineticText({
  text,
  as: Tag = 'h1',
  className = '',
  style,
  ...rest
}: KineticTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const hoverPadding = 'calc(1em / 12)'
  const strokeWidth = 'calc(1em * 125 / 6000)'

  const mergedStyle = {
    '--hover-padding': hoverPadding,
    '--text-stroke-width': strokeWidth,
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties

  return (
    <Tag
      {...rest}
      className={cn(
        'inline-flex flex-wrap [font-optical-sizing:auto]',
        className,
      )}
      style={mergedStyle}
    >
      {text.split('').map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={getLetterStyle(i, hoveredIndex, strokeWidth, hoverPadding)}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  )
}