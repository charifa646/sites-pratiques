import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[8px] bg-[#F4F4F5]',
        className,
      )}
      aria-hidden="true"
    />
  )
}
