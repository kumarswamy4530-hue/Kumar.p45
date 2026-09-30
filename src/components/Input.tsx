import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${leftIcon ? 'has-left-icon' : ''} ${
              rightIcon ? 'has-right-icon' : ''
            } ${error ? 'is-invalid' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightIcon && <span className="input-icon right">{rightIcon}</span>}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="form-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="form-helper">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
