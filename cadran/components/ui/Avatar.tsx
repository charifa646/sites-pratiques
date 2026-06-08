import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  initials: string
  size?: AvatarSize
  className?: string
}

const sizes: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-[#ECFDF5] text-[#047857] font-semibold',
        'flex items-center justify-center shrink-0',
        'border border-[#A7F3D0]',
        sizes[size],
        className,
      )}
      aria-label={`Avatar ${initials}`}
    >
      {initials}
    </div>
  )
}
