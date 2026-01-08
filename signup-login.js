// ============================================
// AUTH PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Bootstrap tabs
    const authTabs = document.getElementById('authTabs');
    if (authTabs) {
        authTabs.addEventListener('shown.bs.tab', function(event) {
            console.log(`Switched to tab: ${event.target.textContent.trim()}`);
        });
    }
    
    // Bootstrap Form Validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (form.checkValidity()) {
                if (form.id === 'loginForm') {
                    processLogin();
                } else if (form.id === 'signupForm') {
                    processSignup();
                }
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Password confirmation validation
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (signupPassword && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (signupPassword.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('Passwords must match');
            } else {
                confirmPassword.setCustomValidity('');
            }
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Process login
function processLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        createToast('Login successful! Redirecting...', 'success');
        
        if (rememberMe) {
            localStorage.setItem('marineUserEmail', email);
        }
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Process signup
function processSignup() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('signupPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        createToast(`Welcome ${firstName}! Account created successfully.`, 'success');
        
        // Save user data (in a real app, this would be an API call)
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            joinedDate: new Date().toISOString()
        };
        
        localStorage.setItem('marineUserData', JSON.stringify(userData));
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Create and show Bootstrap toast
function createToast(message, type) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
    });
}