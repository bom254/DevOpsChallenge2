const form = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('form-status');

if (!form || !nameInput || !emailInput || !submitBtn) {
    throw new Error('Registration form elements not found');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name)                return showError('Name is required.', nameInput);
    if (!email)               return showError('Email is required.', emailInput);
    if (!emailRegex.test(email)) return showError('Enter a valid email address.', emailInput);

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Registering…';

    try {
        const response = await fetch('http://localhost:5004/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch { result = { message: text }; }

        if (!response.ok) throw new Error(result.message || 'Registration failed.');

        if (statusEl) {
            statusEl.textContent = result.message || 'Registration successful.';
            statusEl.className = 'success';
        }
        form.reset();
    } catch (error) {
        console.error('Registration error:', error);
        if (statusEl) {
            statusEl.textContent = error.message || 'Unable to submit registration.';
            statusEl.className = 'error';
        } else {
            alert(error.message || 'Unable to submit registration.');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
    }
});

function showError(message, input) {
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'error';
    } else {
        alert(message);
    }
    input.focus();
}