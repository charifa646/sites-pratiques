import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, id: propId, ...props }, ref) => {
    const generatedId = useId()
    const id = propId ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#18181B]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-10 w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 text-sm text-[#18181B]',
            'placeholder:text-[#A1A1AA]',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-0 focus:border-[#047857]',
            'disabled:bg-[#F4F4F5] disabled:cursor-not-allowed',
            error && 'border-red-400 focus:ring-red-400',
            className,
          )}
          aria-describedby={
            error ? `${id}-error` : helper ? `${id}-helper` : undefined
          }
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {helper && !error && (
          <p id={`${id}-helper`} className="text-xs text-[#71717A]">
            {helper}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
