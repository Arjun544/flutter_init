'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import {
  CodeBlock as CodeBlockPrimitive,
  type CodeBlockProps as CodeBlockPropsPrimitive,
} from '@/components/animate-ui/primitives/animate/code-block';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';
import { getStrictContext } from '@/lib/get-strict-context';

type CodeContextType = {
  code: string;
};

const [CodeProvider, useCode] =
  getStrictContext<CodeContextType>('CodeContext');

type CodeProps = React.ComponentProps<'div'> & {
  code: string;
};

function Code({ className, code, ...props }: CodeProps) {
  return (
    <CodeProvider value={{ code }}>
      <div
        className={cn(
          'relative flex flex-col overflow-hidden border bg-white rounded-lg',
          className,
        )}
        {...props}
      />
    </CodeProvider>
  );
}

type CodeHeaderProps = React.ComponentProps<'div'> & {
  icon?: React.ElementType;
  copyButton?: boolean;
};

function CodeHeader({
  className,
  children,
  icon: Icon,
  copyButton = false,
  ...props
}: CodeHeaderProps) {
  const { code } = useCode();

  return (
    <div
      className={cn(
        'bg-white shrink-0 gap-x-2 border-b border-border/75 dark:border-border/50 text-sm flex text-muted-foreground items-center px-4 w-full h-10',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      {children}
      {copyButton && (
        <CopyButton
          content={code}
          size="xs"
          variant="ghost"
          className="ml-auto w-auto h-auto p-2 -mr-2"
        />
      )}
    </div>
  );
}

type CodeBlockProps = Omit<CodeBlockPropsPrimitive, 'code'> & {
  cursor?: boolean;
  highlightedHtml?: string;
};

function CodeBlock({ cursor, className, highlightedHtml, ...props }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const { code } = useCode();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <CodeBlockPrimitive
      ref={scrollRef}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      scrollContainerRef={scrollRef}
      className={cn(
        'relative text-sm p-4 overflow-auto',
        '[&>pre,&_code]:bg-transparent! [&>pre,&_code]:[background:transparent_!important] [&>pre,&_code]:border-none [&_code]:text-[13px]! [&_code_.line]:px-0!',
        cursor &&
          "data-[done=false]:[&_.line:last-of-type::after]:content-['|'] data-[done=false]:[&_.line:last-of-type::after]:inline-block data-[done=false]:[&_.line:last-of-type::after]:w-[1ch] data-[done=false]:[&_.line:last-of-type::after]:-translate-px",
        className,
      )}
      code={code}
      highlightedHtml={highlightedHtml}
      {...props}
    />
  );
}

export {
  Code,
  CodeHeader,
  CodeBlock,
  type CodeProps,
  type CodeHeaderProps,
  type CodeBlockProps,
};
