// ============================================
// MY BOOKING PAGE - BOOTSTRAP ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Bootstrap components
    const bookingTabs = document.getElementById('bookingTabs');
    if (bookingTabs) {
        bookingTabs.addEventListener('shown.bs.tab', function(event) {
            const activeTab = event.target.getAttribute('data-bs-target');
            console.log(`Switched to tab: ${activeTab}`);
        });
    }
    
    // Booking card interactions
    document.querySelectorAll('.booking-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn') && 
                !e.target.closest('.btn') &&
                !e.target.classList.contains('badge')) {
                const bookingTitle = this.querySelector('h3').textContent;
                createToast(`Viewing: ${bookingTitle}`, 'info');
            }
        });
    });
    
    // Update booking counts
    updateBookingCounts();
});

// Update booking counts in tabs
function updateBookingCounts() {
    const upcomingCount = document.querySelectorAll('#upcoming .booking-card').length;
    const completedCount = document.querySelectorAll('#completed .booking-card').length;
    
    const upcomingBadge = document.querySelector('#upcoming-tab .badge');
    const completedBadge = document.querySelector('#completed-tab .badge');
    
    if (upcomingBadge && upcomingCount > 0) {
        upcomingBadge.textContent = upcomingCount;
    } else if (upcomingBadge) {
        upcomingBadge.remove();
    }
    
    if (completedBadge && completedCount > 0) {
        completedBadge.textContent = completedCount;
    } else if (completedBadge) {
        completedBadge.remove();
    }
}

// Cancel booking function
function cancelBooking() {
    const cancelModal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
    
    // Show loading state
    const cancelBtn = document.querySelector('#cancelModal .btn-danger');
    const originalText = cancelBtn.innerHTML;
    cancelBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Cancelling...';
    cancelBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        createToast('Booking BDG001 cancelled successfully', 'success');
        
        // Close modal
        cancelModal.hide();
        
        // Reset button
        cancelBtn.innerHTML = originalText;
        cancelBtn.disabled = false;
        
        // In a real app, you would refresh the bookings list
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }, 2000);
}

// Book again function
function bookAgain() {
    createToast('Redirecting to package search...', 'info');
    setTimeout(() => {
        window.location.href = 'search-package.html';
    }, 1500);
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