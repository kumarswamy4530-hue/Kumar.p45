import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateIdentifier, validatePassword, initLoginForm } from '../src/login.js';

describe('Login Validation Logic', () => {
  describe('validateIdentifier', () => {
    it('returns error when empty', () => {
      expect(validateIdentifier('')).toBe('Email or username is required.');
      expect(validateIdentifier('   ')).toBe('Email or username is required.');
    });

    it('validates email format if string contains @', () => {
      expect(validateIdentifier('invalid-email@')).toBe('Please enter a valid email address.');
      expect(validateIdentifier('invalid-email@domain')).toBe('Please enter a valid email address.');
      expect(validateIdentifier('user@example.com')).toBe('');
    });

    it('validates username length if no @ present', () => {
      expect(validateIdentifier('ab')).toBe('Username must be at least 3 characters.');
      expect(validateIdentifier('user123')).toBe('');
    });
  });

  describe('validatePassword', () => {
    it('returns error when empty', () => {
      expect(validatePassword('')).toBe('Password is required.');
    });

    it('returns error when under 6 characters', () => {
      expect(validatePassword('12345')).toBe('Password must be at least 6 characters.');
      expect(validatePassword('123456')).toBe('');
    });
  });
});

describe('Login Form DOM Interaction', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <main class="login-container">
        <div class="login-card">
          <form id="login-form" novalidate>
            <div id="status-message" class="status-message"></div>
            <div class="form-group">
              <label for="identifier">Email or Username</label>
              <div class="input-wrapper">
                <input type="text" id="identifier" name="identifier" />
              </div>
              <span id="identifier-error" class="error-message"></span>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper password-wrapper">
                <input type="password" id="password" name="password" />
                <button type="button" id="toggle-password" class="toggle-password-btn" aria-label="Show password">
                  <span class="eye-open">Open</span>
                  <span class="eye-closed hidden">Closed</span>
                </button>
              </div>
              <span id="password-error" class="error-message"></span>
            </div>
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" id="remember-me" name="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" id="forgot-password-link">Forgot password?</a>
            </div>
            <button type="submit" id="submit-btn" class="submit-btn">
              <span class="btn-text">Sign In</span>
              <span class="spinner hidden"></span>
            </button>
          </form>
        </div>
      </main>
    `;
  });

  it('toggles password visibility', () => {
    initLoginForm(document);
    const passwordInput = document.querySelector('#password');
    const toggleBtn = document.querySelector('#toggle-password');
    const eyeOpen = toggleBtn.querySelector('.eye-open');
    const eyeClosed = toggleBtn.querySelector('.eye-closed');

    expect(passwordInput.type).toBe('password');

    toggleBtn.click();
    expect(passwordInput.type).toBe('text');
    expect(toggleBtn.getAttribute('aria-label')).toBe('Hide password');
    expect(eyeOpen.classList.contains('hidden')).toBe(true);
    expect(eyeClosed.classList.contains('hidden')).toBe(false);

    toggleBtn.click();
    expect(passwordInput.type).toBe('password');
    expect(toggleBtn.getAttribute('aria-label')).toBe('Show password');
  });

  it('shows error messages on submit with empty fields', () => {
    initLoginForm(document);
    const form = document.querySelector('#login-form');
    const identifierError = document.querySelector('#identifier-error');
    const passwordError = document.querySelector('#password-error');

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(identifierError.textContent).toBe('Email or username is required.');
    expect(passwordError.textContent).toBe('Password is required.');
  });

  it('handles remember me and saves identifier to localStorage', async () => {
    vi.useFakeTimers();
    initLoginForm(document);

    const identifierInput = document.querySelector('#identifier');
    const passwordInput = document.querySelector('#password');
    const rememberCheckbox = document.querySelector('#remember-me');
    const form = document.querySelector('#login-form');

    identifierInput.value = 'john.doe@example.com';
    passwordInput.value = 'secret123';
    rememberCheckbox.checked = true;

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(localStorage.getItem('remembered_identifier')).toBe('john.doe@example.com');

    vi.advanceTimersByTime(1000);

    const statusMessage = document.querySelector('#status-message');
    expect(statusMessage.textContent).toBe('Login successful! Redirecting...');
    vi.useRealTimers();
  });

  it('handles forgot password link click', () => {
    initLoginForm(document);
    const forgotLink = document.querySelector('#forgot-password-link');
    const identifierInput = document.querySelector('#identifier');
    const statusMessage = document.querySelector('#status-message');

    forgotLink.click();
    expect(statusMessage.textContent).toContain('Please enter your email or username above first');

    identifierInput.value = 'user@example.com';
    forgotLink.click();
    expect(statusMessage.textContent).toBe('Password reset link sent to "user@example.com". Please check your inbox.');
  });
});
