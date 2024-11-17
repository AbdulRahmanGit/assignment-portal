document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const toast = document.getElementById('toast');

    // Validation patterns
    const patterns = {
        username: /^[a-zA-Z0-9_]{3,20}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    };

    // Error messages
    const errorMessages = {
        username: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters and contain at least one letter and one number',
        required: 'This field is required'
    };

    // Show toast message
    function showToast(message, type) {
        toast.className = `toast show ${type}`;
        toast.querySelector('.toast-message').textContent = message;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }

    // Validate single field
    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!field.value) {
            errorElement.textContent = errorMessages.required;
            return false;
        }

        if (patterns[field.id] && !patterns[field.id].test(field.value)) {
            errorElement.textContent = errorMessages[field.id];
            return false;
        }

        errorElement.textContent = '';
        return true;
    }

    // Add input event listeners for real-time validation
    ['username', 'email', 'password'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', () => validateField(field));
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const userType = document.getElementById('userType');
        
        // Validate all fields
        const isUsernameValid = validateField(username);
        const isEmailValid = validateField(email);
        const isPasswordValid = validateField(password);

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value,
                    role: userType.value
                })
            });

            const data = await response.json();
            console.log(data.body);
            if (response.ok) {
                showToast('Registration successful! Please login.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 10000);
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    });
});