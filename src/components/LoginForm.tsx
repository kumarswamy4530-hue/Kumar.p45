import type { FormEvent, ChangeEvent, FC } from 'react'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react'
import { Input } from './Input'
import { Button } from './Button'
import { Checkbox } from './Checkbox'

export interface LoginFormProps {
  onSuccess?: (data: { identifier: string; rememberMe: boolean }) => void
  onForgotPassword?: () => void
}

export const LoginForm: FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {}

    if (!identifier.trim()) {
      newErrors.identifier = 'Email or username is required'
    } else if (identifier.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(identifier.trim())) {
        newErrors.identifier = 'Please enter a valid email address'
      }
    } else if (identifier.trim().length < 3) {
      newErrors.identifier = 'Username must be at least 3 characters'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API authentication call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (password === 'wrongpassword') {
        setErrors({ general: 'Invalid email/username or password.' })
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
      setIsLoading(false)
      if (onSuccess) {
        onSuccess({ identifier, rememberMe })
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="login-success-card">
        <div className="success-icon-wrapper">
          <CheckCircle size={48} className="success-icon" />
        </div>
        <h2>Welcome back!</h2>
        <p className="success-message">
          You have successfully logged in as <strong>{identifier}</strong>.
        </p>
        <Button
          variant="outline"
          fullWidth
          onClick={() => {
            setIsSubmitted(false)
            setPassword('')
          }}
        >
          Sign in as another user
        </Button>
      </div>
    )
  }

  const isEmail = identifier.includes('@')

  return (
    <div className="login-card">
      <div className="login-header">
        <h2>Sign in to your account</h2>
        <p>Enter your details below to continue</p>
      </div>

      {errors.general && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email or Username"
          type="text"
          name="identifier"
          placeholder="name@example.com or username"
          value={identifier}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setIdentifier(e.target.value)
            if (errors.identifier) {
              setErrors((prev) => ({ ...prev, identifier: undefined }))
            }
          }}
          error={errors.identifier}
          leftIcon={isEmail ? <Mail size={18} /> : <User size={18} />}
          autoComplete="username"
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }))
            }
          }}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          autoComplete="current-password"
          required
        />

        <div className="login-options">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          />
          <button
            type="button"
            className="forgot-password-link"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="submit-btn">
          Sign In
        </Button>
      </form>
    </div>
  )
}
