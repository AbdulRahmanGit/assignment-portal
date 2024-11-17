document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const toast = document.getElementById('toast');

    function showToast(message, type) {
        toast.className = `toast show ${type}`;
        toast.querySelector('.toast-message').textContent = message;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }

    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!field.value) {
            errorElement.textContent = 'This field is required';
            return false;
        }

        errorElement.textContent = '';
        return true;
    }

    ['username', 'password'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', () => validateField(field));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const userType = document.getElementById('userType');

        if (!validateField(username) || !validateField(password)) {
            return;
        }
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                    userType: userType.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', userType.value);
                showToast('Login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = userType.value === 'admin' 
                        ? 'admin-dashboard.html' 
                        : 'user-dashboard.html';
                }, 1500);
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    });
});