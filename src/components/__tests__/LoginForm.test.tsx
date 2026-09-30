import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from '../LoginForm'

describe('LoginForm Component', () => {
  it('renders all form fields, buttons, and links', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email or username/i)).toBeDefined()
    expect(screen.getByLabelText(/^password/i)).toBeDefined()
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })

  it('validates empty inputs on form submission', async () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Email or username is required')).toBeDefined()
    expect(await screen.findByText('Password is required')).toBeDefined()
  })

  it('validates invalid email format', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'invalid-email@' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'secret123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Please enter a valid email address')).toBeDefined()
  })

  it('toggles password visibility when show/hide button is clicked', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /show password/i })

    expect(passwordInput.type).toBe('password')

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }))
    expect(passwordInput.type).toBe('password')
  })

  it('handles remember me checkbox toggle', () => {
    render(<LoginForm />)

    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i }) as HTMLInputElement
    expect(rememberMeCheckbox.checked).toBe(false)

    fireEvent.click(rememberMeCheckbox)
    expect(rememberMeCheckbox.checked).toBe(true)
  })

  it('calls onForgotPassword prop when forgot password link is clicked', () => {
    const handleForgotPassword = vi.fn()
    render(<LoginForm onForgotPassword={handleForgotPassword} />)

    fireEvent.click(screen.getByRole('button', { name: /forgot password\?/i }))
    expect(handleForgotPassword).toHaveBeenCalledTimes(1)
  })

  it('submits successfully with valid credentials and invokes onSuccess', async () => {
    const handleSuccess = vi.fn()
    render(<LoginForm onSuccess={handleSuccess} />)

    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /remember me/i }))

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(
      () => {
        expect(handleSuccess).toHaveBeenCalledWith({
          identifier: 'user@example.com',
          rememberMe: true,
        })
      },
      { timeout: 3000 }
    )

    expect(screen.getByText(/welcome back!/i)).toBeDefined()
  })
})
