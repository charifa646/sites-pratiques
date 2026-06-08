'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'transition-all duration-150 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#047857] ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'active:scale-[0.97]'

const variants: Record<Variant, string> = {
  primary:
    'bg-[#047857] text-white hover:bg-[#065F46] rounded-[10px] shadow-[0_1px_2px_rgba(4,120,87,.24)]',
  secondary:
    'bg-white text-[#18181B] border border-[#E4E4E7] hover:bg-[#F4F4F5] hover:border-[#D4D4D8] rounded-[10px]',
  ghost:
    'text-[#3F3F46] hover:bg-[#F4F4F5] rounded-[10px]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <Loader2
            size={16}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
