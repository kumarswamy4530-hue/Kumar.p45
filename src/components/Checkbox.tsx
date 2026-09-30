import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="checkbox-group">
        <label htmlFor={checkboxId} className="checkbox-label">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            className={`checkbox-input ${className}`}
            {...props}
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-text">{label}</span>
        </label>
        {error && <p className="form-error">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
