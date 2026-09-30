export function validateIdentifier(value) {
  if (!value || !value.trim()) {
    return 'Email or username is required.';
  }
  const trimmed = value.trim();
  if (trimmed.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
  } else {
    if (trimmed.length < 3) {
      return 'Username must be at least 3 characters.';
    }
  }
  return '';
}

export function validatePassword(value) {
  if (!value) {
    return 'Password is required.';
  }
  if (value.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return '';
}

export function initLoginForm(container = document) {
  const form = container.querySelector('#login-form');
  if (!form) return;

  const identifierInput = container.querySelector('#identifier');
  const passwordInput = container.querySelector('#password');
  const identifierError = container.querySelector('#identifier-error');
  const passwordError = container.querySelector('#password-error');
  const togglePasswordBtn = container.querySelector('#toggle-password');
  const statusMessage = container.querySelector('#status-message');
  const submitBtn = container.querySelector('#submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;
  const forgotPasswordLink = container.querySelector('#forgot-password-link');

  // Load remembered username/email if present
  try {
    const savedIdentifier = localStorage.getItem('remembered_identifier');
    if (savedIdentifier && identifierInput) {
      identifierInput.value = savedIdentifier;
      const rememberCheckbox = container.querySelector('#remember-me');
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  } catch (e) {
    // LocalStorage error fallback
  }

  // Toggle password visibility
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
      const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

      if (eyeOpen && eyeClosed) {
        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);
      }

      const ariaLabel = isPassword ? 'Hide password' : 'Show password';
      togglePasswordBtn.setAttribute('aria-label', ariaLabel);
      togglePasswordBtn.setAttribute('title', ariaLabel);
    });
  }

  function clearError(input, errorElement) {
    if (errorElement) errorElement.textContent = '';
    if (input && input.parentElement) {
      input.parentElement.parentElement.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }
  }

  function showError(input, errorElement, message) {
    if (errorElement) errorElement.textContent = message;
    if (input && input.parentElement) {
      input.parentElement.parentElement.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
    }
  }

  function setStatus(message, type) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
  }

  function clearStatus() {
    if (!statusMessage) return;
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }

  if (identifierInput) {
    identifierInput.addEventListener('input', () => {
      clearError(identifierInput, identifierError);
      clearStatus();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      clearError(passwordInput, passwordError);
      clearStatus();
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currentVal = identifierInput ? identifierInput.value.trim() : '';
      if (!currentVal) {
        setStatus('Please enter your email or username above first to reset your password.', 'error');
        showError(identifierInput, identifierError, 'Required for password reset.');
      } else {
        setStatus(`Password reset link sent to "${currentVal}". Please check your inbox.`, 'success');
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifierVal = identifierInput ? identifierInput.value : '';
    const passwordVal = passwordInput ? passwordInput.value : '';

    const idError = validateIdentifier(identifierVal);
    const passError = validatePassword(passwordVal);

    let hasError = false;

    if (idError) {
      showError(identifierInput, identifierError, idError);
      hasError = true;
    } else {
      clearError(identifierInput, identifierError);
    }

    if (passError) {
      showError(passwordInput, passwordError, passError);
      hasError = true;
    } else {
      clearError(passwordInput, passwordError);
    }

    if (hasError) return;

    // Handle "Remember Me"
    const rememberCheckbox = container.querySelector('#remember-me');
    try {
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem('remembered_identifier', identifierVal.trim());
      } else {
        localStorage.removeItem('remembered_identifier');
      }
    } catch (e) {
      // LocalStorage fallback
    }

    // Submit state UI
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Signing in...';
    if (spinner) spinner.classList.remove('hidden');
    clearStatus();

    // Simulate async API call
    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Sign In';
      if (spinner) spinner.classList.add('hidden');

      setStatus('Login successful! Redirecting...', 'success');
    }, 1000);
  });
}
