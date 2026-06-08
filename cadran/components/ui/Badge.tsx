import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type BadgeVariant = 'paid' | 'pending' | 'default' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variants: Record<BadgeVariant, string> = {
  paid: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] border',
  pending: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] border',
  default: 'bg-[#F4F4F5] text-[#71717A] border-[#E4E4E7] border',
  warning: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] border',
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
