import React, { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { Input } from './components/Input'
import { Button } from './components/Button'

export function App() {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSubmitted, setResetSubmitted] = useState(false)
  const [resetError, setResetError] = useState('')

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetError('Please enter a valid email address')
      return
    }
    setResetError('')
    setResetSubmitted(true)
  }

  const closeResetModal = () => {
    setShowForgotPasswordModal(false)
    setResetEmail('')
    setResetSubmitted(false)
    setResetError('')
  }

  return (
    <>
      <header className="app-header">
        <div className="brand-logo">
          <span className="logo-badge">A</span>
          <span>App Portal</span>
        </div>
      </header>

      <main className="app-container">
        <LoginForm
          onSuccess={(data) => {
            console.log('Login successful:', data)
          }}
          onForgotPassword={() => setShowForgotPasswordModal(true)}
        />

        {showForgotPasswordModal && (
          <div className="modal-overlay" onClick={closeResetModal}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reset Password</h3>
                <p>
                  {resetSubmitted
                    ? 'Password reset instructions have been sent to your email.'
                    : 'Enter your account email address and we will send you a reset link.'}
                </p>
              </div>

              {!resetSubmitted ? (
                <form onSubmit={handleForgotPasswordSubmit}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value)
                      if (resetError) setResetError('')
                    }}
                    error={resetError}
                    required
                  />

                  <div className="modal-actions">
                    <Button type="button" variant="outline" fullWidth onClick={closeResetModal}>
                      Cancel
                    </Button>
                    <Button type="submit" fullWidth>
                      Send Link
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="modal-actions">
                  <Button fullWidth onClick={closeResetModal}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default App
