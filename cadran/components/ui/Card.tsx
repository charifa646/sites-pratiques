import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[16px] border border-[#E4E4E7]',
        '[box-shadow:0_1px_2px_rgba(24,24,27,.04),0_12px_30px_-14px_rgba(24,24,27,.12)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
