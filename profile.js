// ============================================
// PROFILE PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const editBtn = document.getElementById('editBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const profileForm = document.getElementById('profileForm');
    const formActions = document.getElementById('formActions');
    const formInputs = profileForm.querySelectorAll('input, textarea');
    
    // Enable editing
    editBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = false;
            input.classList.remove('bg-light');
        });
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
        createToast('Editing mode enabled', 'info');
    });
    
    // Cancel editing
    cancelBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('bg-light');
        });
        formActions.style.display = 'none';
        editBtn.style.display = 'block';
        profileForm.reset();
        createToast('Changes cancelled', 'warning');
    });
    
    // Save changes
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            createToast('Profile updated successfully!', 'success');
            
            formInputs.forEach(input => {
                input.disabled = true;
                input.classList.add('bg-light');
            });
            formActions.style.display = 'none';
            editBtn.style.display = 'block';
            
            // Save to localStorage (simulated)
            const userData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('marineUserProfile', JSON.stringify(userData));
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Toggle switches
    const toggles = document.querySelectorAll('.form-check-input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const preferenceItem = this.closest('.list-group-item');
            const preferenceName = preferenceItem.querySelector('h4').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            
            createToast(`${preferenceName} ${status}`, 'info');
            
            // Save preferences
            const preferences = {
                emailNotifications: document.querySelectorAll('.form-check-input')[0].checked,
                newsletter: document.querySelectorAll('.form-check-input')[1].checked,
                smsAlerts: document.querySelectorAll('.form-check-input')[2].checked
            };
            
            localStorage.setItem('marineUserPreferences', JSON.stringify(preferences));
        });
    });
    
    // Load saved data
    loadSavedProfileData();
    loadSavedPreferences();
});

// Load saved profile data
function loadSavedProfileData() {
    const savedData = localStorage.getItem('marineUserProfile');
    if (savedData) {
        const userData = JSON.parse(savedData);
        
        document.getElementById('firstName').value = userData.firstName || 'John';
        document.getElementById('lastName').value = userData.lastName || 'Doe';
        document.getElementById('email').value = userData.email || 'john.doe@example.com';
        document.getElementById('phone').value = userData.phone || '+1 (555) 123-4567';
        document.getElementById('address').value = userData.address || '123 Ocean Drive, Miami Beach, FL 33139';
    }
}

// Load saved preferences
function loadSavedPreferences() {
    const savedPrefs = localStorage.getItem('marineUserPreferences');
    if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        
        const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
        checkboxes[0].checked = prefs.emailNotifications || true;
        checkboxes[1].checked = prefs.newsletter || true;
        checkboxes[2].checked = prefs.smsAlerts || false;
    }
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

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});